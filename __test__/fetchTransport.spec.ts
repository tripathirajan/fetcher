import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTransport } from '../src/transports/fetchTransport';

describe('fetchTransport', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should perform a basic fetch request', async () => {
    const mockResponse = new Response(JSON.stringify({ hello: 'world' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await fetchTransport({
      url: 'https://api.example.com/test',
      config: { method: 'GET' },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({ method: 'GET' }),
    );

    const json = await response.json();
    expect(json).toEqual({ hello: 'world' });
  });

  it('should retry on failure', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

    globalThis.fetch = fetchMock;

    const response = await fetchTransport({
      url: 'https://api.example.com/retry',
      config: { method: 'GET' },
      retries: 1,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const json = await response.json();
    expect(json).toEqual({ ok: true });
  });

  it('should timeout if the request takes too long', async () => {
    vi.useFakeTimers();

    let abortHandler: (() => void) | undefined;

    globalThis.fetch = vi.fn((_: RequestInfo | URL, config?: RequestInit) => {
      config?.signal?.addEventListener('abort', () => {
        abortHandler?.();
      });

      return new Promise((resolve, reject) => {
        abortHandler = () => reject(new DOMException('Aborted', 'AbortError'));
        setTimeout(() => {
          resolve(new Response());
        }, 5000);
      });
    }) as typeof fetch;

    const promise = fetchTransport({
      url: 'https://api.example.com/timeout',
      config: { method: 'GET' },
      timeout: 1000,
    });

    // Advance time so abort fires
    vi.advanceTimersByTime(2000);

    await expect(promise).rejects.toThrow(/Aborted|Timeout/i);

    vi.useRealTimers();
  }, 10000);

  it('should call onDownloadProgress during streaming', async () => {
    const textEncoder = new TextEncoder();
    const chunks = [textEncoder.encode('part1'), textEncoder.encode('part2')];

    const reader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: chunks[0] })
        .mockResolvedValueOnce({ done: false, value: chunks[1] })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => reader },
      headers: new Headers({ 'Content-Length': '10' }),
      status: 200,
      statusText: 'OK',
    } as unknown as Response);

    const onProgress = vi.fn();

    const response = await fetchTransport({
      url: 'https://api.example.com/download',
      config: { method: 'GET' },
      onDownloadProgress: onProgress,
    });

    expect(onProgress).toHaveBeenCalledWith(expect.any(Number), 10);
    expect(response).toBeInstanceOf(Response);
  }, 10000);
});

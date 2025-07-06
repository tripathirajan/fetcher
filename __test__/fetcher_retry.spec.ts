import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fetcher from '../src/Fetcher';

describe('Fetcher - Retry & Timeout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should retry failed requests', async () => {
    vi.useFakeTimers();
    const mockResponse = { message: 'Success after retry' };

    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as unknown as Response);

    globalThis.fetch = fetchMock;

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
      retries: 1,
    });

    const promise = api.get('/retry');

    // Fast-forward timers to allow retry
    vi.advanceTimersByTime(1000);

    const data = (await promise) as Response;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(await data.json()).toEqual(mockResponse);

    vi.useRealTimers();
  });

  it('should timeout if the request takes too long', async () => {
    vi.useFakeTimers();
    let abortHandler: (() => void) | undefined;

    globalThis.fetch = vi.fn((_, config: RequestInit) => {
      config.signal?.addEventListener('abort', () => {
        abortHandler?.();
      });

      return new Promise((resolve, reject) => {
        abortHandler = () =>
          reject(new DOMException('Request timed out', 'AbortError'));
        setTimeout(() => {
          resolve(new Response());
        }, 5000);
      });
    }) as typeof fetch;

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
      timeout: 1000,
    });

    const promise = api.get('/timeout');

    vi.advanceTimersByTime(2000);

    await expect(promise).rejects.toThrow('Request timed out');

    vi.useRealTimers();
  });
});

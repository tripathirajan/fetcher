import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fetcher from '../src/Fetcher';

describe('Fetcher - Progress', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should report download progress', async () => {
    const textEncoder = new TextEncoder();
    const chunks = [textEncoder.encode('chunk1'), textEncoder.encode('chunk2')];

    const reader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: chunks[0] })
        .mockResolvedValueOnce({ done: false, value: chunks[1] })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => reader,
      },
      headers: new Headers({ 'Content-Length': '12' }),
      status: 200,
      statusText: 'OK',
    } as unknown as Response);

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
    });

    const onProgress = vi.fn();

    const blob = await api.downloadWithProgress('/file', onProgress);

    expect(onProgress).toHaveBeenCalled();
    expect(blob).toHaveProperty('size');
  });
});

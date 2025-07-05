import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fetcher from '../src/Fetcher';

describe('Fetcher - GET', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error if response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      text: () => Promise.resolve('Internal error'),
      json: () => Promise.resolve({ error: 'Internal error' }),
    } as unknown as Response);

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
    });

    await expect(api.get('/error')).rejects.toThrow('HTTP 500: Internal error');
  });

  // it('should include credentials if configured', async () => {
  //   const mockResponse = { message: 'with credentials' };

  //   globalThis.fetch = vi.fn().mockResolvedValue({
  //     ok: true,
  //     json: () => Promise.resolve(mockResponse),
  //   } as unknown as Response);

  //   const api = new Fetcher({
  //     baseURL: 'https://api.example.com',
  //     credentials: 'include',
  //   });

  //   await api.get('/credentials');

  //   expect(fetch).toHaveBeenCalledWith(
  //     'https://api.example.com/credentials',
  //     expect.objectContaining({
  //       credentials: 'include',
  //     }),
  //   );
  // });

  // it('should perform a GET request and return JSON', async () => {
  //   const mockResponse = { message: 'Hello' };

  //   // Mock fetch
  //   globalThis.fetch = vi.fn().mockResolvedValue({
  //     ok: true,
  //     json: () => Promise.resolve(mockResponse),
  //   } as unknown as Response);

  //   const api = new Fetcher({
  //     baseURL: 'https://api.example.com',
  //     timeout: 1000,
  //   });

  //   const data = await api.get('/test');

  //   expect(fetch).toHaveBeenCalledWith(
  //     'https://api.example.com/test',
  //     expect.objectContaining({
  //       method: 'GET',
  //     }),
  //   );

  //   expect(data).toEqual(mockResponse);
  // });
});

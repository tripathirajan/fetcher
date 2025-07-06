import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fetcher from '../src/Fetcher';

describe('Fetcher - Interceptors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should apply request and response interceptors', async () => {
    const mockResponse = { result: 'ok' };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      clone: function () {
        return this;
      },
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
    });

    const requestInterceptor = vi.fn((config) => ({
      ...config,
      headers: {
        ...config.headers,
        'X-Test': '123',
      },
    }));

    const responseInterceptor = vi.fn(async (response) => {
      return response;
    });

    api.interceptors.request.use(requestInterceptor);
    api.interceptors.response.use(responseInterceptor);

    const data = (await api.get('/intercept')) as Response;

    expect(requestInterceptor).toHaveBeenCalled();
    expect(responseInterceptor).toHaveBeenCalled();
    expect(await data.json()).toEqual(mockResponse);
  });
});

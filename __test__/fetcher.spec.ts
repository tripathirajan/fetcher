import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fetcher from '../src/Fetcher';

describe('Fetcher', () => {
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

  it('should include credentials if configured', async () => {
    const mockResponse = { message: 'with credentials' };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
      credentials: 'include',
    });

    await api.get('/credentials');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/credentials',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('should perform a GET request and return JSON', async () => {
    const mockResponse = { message: 'Hello' };

    // Mock fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
      timeout: 1000,
    });

    const data = await api.get('/test');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'GET',
      }),
    );

    expect(data).toEqual(mockResponse);
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

    const data = await api.get('/intercept');

    expect(requestInterceptor).toHaveBeenCalled();
    expect(responseInterceptor).toHaveBeenCalled();
    expect(data).toEqual(mockResponse);
  });

  it('should perform a POST request with JSON body', async () => {
    const mockResponse = { id: 1 };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
    });

    const body = { name: 'Test' };

    const data = await api.post('/items', body);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );

    expect(data).toEqual(mockResponse);
  });

  it('should timeout if the request takes too long', async () => {
    vi.useFakeTimers();
    let abortHandler: (() => void) | undefined;

    globalThis.fetch = vi.fn((_, config: RequestInit) => {
      config.signal?.addEventListener('abort', () => {
        abortHandler?.();
      });

      return new Promise((resolve, reject) => {
        abortHandler = () => reject(new DOMException('Aborted', 'AbortError'));
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

  it('should retry failed requests', async () => {
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

    const data = await api.get('/retry');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(data).toEqual(mockResponse);
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

  it('should set withCredentials in XHR upload', async () => {
    const sendMock = vi.fn();
    const openMock = vi.fn();
    const setRequestHeaderMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let onloadCallback: (() => void) | undefined = () => {};

    const xhrMock = {
      open: openMock,
      setRequestHeader: setRequestHeaderMock,
      send: sendMock,
      upload: {
        onprogress: undefined,
      },
      onload: undefined as unknown | (() => void),
      onerror: undefined,
      ontimeout: undefined,
      response: JSON.stringify({ ok: true }), // <-- changed here
      status: 200,
      statusText: 'OK',
      getAllResponseHeaders: () => '',
      addEventListener: function (event: string, callback: () => void) {
        if (event === 'load' && typeof callback === 'function') {
          onloadCallback = callback;
        }
      },
    };

    globalThis.XMLHttpRequest = vi
      .fn()
      .mockImplementation(() => xhrMock) as unknown as typeof XMLHttpRequest;

    const api = new Fetcher({
      baseURL: 'https://api.example.com',
      credentials: 'include',
    });

    const promise = api.postWithUploadProgress('/upload', 'data', () => {});
    if (xhrMock.onload && typeof xhrMock.onload === 'function')
      xhrMock.onload();
    await promise;

    expect(globalThis.XMLHttpRequest).toHaveBeenCalled();
    expect(openMock).toHaveBeenCalledWith(
      'POST',
      'https://api.example.com/upload',
      true,
    );
    expect(sendMock).toHaveBeenCalled();
  });
});

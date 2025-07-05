import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fetcher from '../src/Fetcher';

describe('Fetcher - POST', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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

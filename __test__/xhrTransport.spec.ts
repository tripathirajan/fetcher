import { describe, it, expect, vi, beforeEach } from 'vitest';
import { xhrTransport } from '../src/transports/xhrTransport';

describe('xhrTransport', () => {
  let xhrMock: Record<string, unknown>;
  let openMock: typeof vi.fn;
  let sendMock: typeof vi.fn;
  let setRequestHeaderMock: typeof vi.fn;

  beforeEach(() => {
    openMock = vi.fn();
    sendMock = vi.fn();
    setRequestHeaderMock = vi.fn();

    xhrMock = {
      open: openMock,
      setRequestHeader: setRequestHeaderMock,
      send: sendMock,
      response: JSON.stringify({ ok: true }),
      status: 200,
      statusText: 'OK',
      getAllResponseHeaders: () => 'Content-Type: application/json',
      upload: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xhrConstructorMock: any = vi.fn().mockImplementation(() => xhrMock);
    Object.defineProperties(xhrConstructorMock, {
      UNSENT: { value: 0, writable: false, configurable: false },
      OPENED: { value: 1, writable: false, configurable: false },
      HEADERS_RECEIVED: { value: 2, writable: false, configurable: false },
      LOADING: { value: 3, writable: false, configurable: false },
      DONE: { value: 4, writable: false, configurable: false },
    });
    globalThis.XMLHttpRequest =
      xhrConstructorMock as unknown as typeof XMLHttpRequest;
  });

  it('should perform a basic XHR request', async () => {
    const promise = xhrTransport({
      url: 'https://api.example.com/test',
      method: 'GET',
    });

    if (xhrMock.onload && typeof xhrMock.onload === 'function')
      xhrMock.onload();

    const response = await promise;
    const text = await response.text();
    const json = JSON.parse(text);

    expect(openMock).toHaveBeenCalledWith(
      'GET',
      'https://api.example.com/test',
      true,
    );
    expect(sendMock).toHaveBeenCalled();
    expect(json).toEqual({ ok: true });
  });

  it('should handle download progress', async () => {
    const onDownloadProgress = vi.fn();

    const promise = xhrTransport({
      url: 'https://api.example.com/progress',
      method: 'GET',
      onDownloadProgress,
    });

    if (xhrMock.onprogress && typeof xhrMock.onprogress === 'function')
      xhrMock.onprogress({ loaded: 50, total: 100 });

    if (xhrMock.onload && typeof xhrMock.onload === 'function')
      xhrMock.onload();

    await promise;

    expect(onDownloadProgress).toHaveBeenCalledWith({ loaded: 50, total: 100 });
  });

  it('should handle upload progress', async () => {
    const onUploadProgress = vi.fn();

    xhrMock.upload = {};
    Object.defineProperty(xhrMock.upload, 'onprogress', {
      set(handler) {
        // Call the handler immediately for testing
        handler({ loaded: 30, total: 60 });
      },
    });

    const promise = xhrTransport({
      url: 'https://api.example.com/upload',
      method: 'POST',
      onUploadProgress,
    });

    if (xhrMock.onload && typeof xhrMock.onload === 'function')
      xhrMock.onload();

    await promise;

    expect(onUploadProgress).toHaveBeenCalledWith({ loaded: 30, total: 60 });
  });

  it('should handle errors', async () => {
    const promise = xhrTransport({
      url: 'https://api.example.com/error',
      method: 'GET',
    });

    if (xhrMock.onerror && typeof xhrMock.onerror === 'function')
      xhrMock.onerror();

    await expect(promise).rejects.toThrow('XHR Network Error');
  });

  it('should handle timeouts', async () => {
    const promise = xhrTransport({
      url: 'https://api.example.com/timeout',
      method: 'GET',
    });

    if (xhrMock.ontimeout && typeof xhrMock.ontimeout === 'function')
      xhrMock.ontimeout();

    await expect(promise).rejects.toThrow('XHR Timeout');
  });
});

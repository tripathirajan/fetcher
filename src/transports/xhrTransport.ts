import type { XhrTransportOptions } from '../types';

/**
 * Performs an HTTP request using XMLHttpRequest with optional progress and timeout support.
 *
 * @param options - The XhrTransportOptions.
 * @returns A promise resolving to a Response object.
 */
export function xhrTransport(options: XhrTransportOptions): Promise<Response> {
  const {
    url,
    method,
    headers,
    body,
    timeout,
    onDownloadProgress,
    onUploadProgress,
  } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    if (options.credentials === 'include') {
      xhr.withCredentials = true;
    }

    if (timeout) {
      xhr.timeout = timeout;
    }

    if (headers) {
      Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    }

    xhr.responseType = 'blob';

    if (onDownloadProgress) {
      xhr.onprogress = onDownloadProgress;
    }

    if (onUploadProgress && xhr.upload) {
      xhr.upload.onprogress = onUploadProgress;
    }

    xhr.onload = () => {
      const headers = new Headers();
      xhr
        .getAllResponseHeaders()
        .trim()
        .split(/[\r\n]+/)
        .forEach((line) => {
          const parts = line.split(': ');
          const key = parts.shift();
          if (key) {
            headers.append(key, parts.join(': '));
          }
        });

      resolve(
        new Response(xhr.response, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers,
        }),
      );
    };

    xhr.onerror = () => reject(new Error('XHR Network Error'));
    xhr.ontimeout = () => reject(new Error('XHR Timeout'));

    xhr.send(body ?? null);
  });
}

import { withRetries } from '../utils';

/**
 * Options for the fetchTransport function.
 *
 * @property url - The full request URL.
 * @property config - The RequestInit configuration object.
 * @property timeout - Optional timeout in milliseconds.
 * @property retries - Optional number of retries.
 * @property onDownloadProgress - Optional callback for download progress.
 */
export interface FetchTransportOptions {
  url: string;
  config: RequestInit;
  timeout?: number;
  retries?: number;
  onDownloadProgress?: (loaded: number, total: number | null) => void;
}

/**
 * Performs an HTTP request using the Fetch API with optional timeout, retries, and download progress.
 *
 * @param options - The FetchTransportOptions.
 * @returns A promise resolving to a Response object.
 */
export async function fetchTransport(
  options: FetchTransportOptions,
): Promise<Response> {
  const { url, config, timeout, retries, onDownloadProgress } = options;

  const fetchPromise = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const finalConfig = { ...config, signal };

    if (config.credentials) {
      finalConfig.credentials = config.credentials;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (timeout) {
      timeoutId = setTimeout(() => controller.abort(), timeout);
    }

    try {
      const response = await fetch(url, finalConfig);

      if (onDownloadProgress && response.body) {
        const reader = response.body.getReader();
        const contentLength =
          Number(response.headers.get('Content-Length')) || null;
        let received = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            onDownloadProgress(received, contentLength);
          }
        }

        const blob = new Blob(chunks as BlobPart[]);
        return new Response(blob, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      }

      return response;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  return withRetries(fetchPromise, retries ?? 0);
}

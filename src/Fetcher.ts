/**
 * Fetcher provides a universal HTTP client that supports fetch and XHR fallback.
 * Use it to perform HTTP requests with retries, timeouts, interceptors, and progress reporting.
 */
import { fetchTransport } from './transports/fetchTransport';
import { xhrTransport } from './transports/xhrTransport';

/**
 * @interface
 * Configuration options for the Fetcher client.
 * - `baseURL`: The base URL for all requests.
 * - `headers`: Default headers to include in every request.
 * - `timeout`: Default timeout for requests in milliseconds.
 * - `retries`: Number of times to retry failed requests.
 * - `credentials`: Credentials mode for requests (e.g., 'same-origin', 'include', 'omit').
 */
interface FetcherConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  credentials?: RequestCredentials;
}

/**
 * Configuration for an individual request, extending RequestInit.
 * Includes optional timeout and retries.
 * @public
 */
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * A function to intercept and modify the request before it is sent.
 * @public
 */
type RequestInterceptor = (
  config: RequestInit,
) => Promise<RequestInit> | RequestInit;

/**
 * A function to intercept and modify the response after it is received.
 * @public
 */
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

/**
 * Fetcher is a universal HTTP client that supports fetch and XHR fallback.
 * It provides methods for making requests, handling responses, and managing interceptors.
 * It supports automatic retries, timeouts, and progress reporting for downloads and uploads.
 * @class
 * @example
 * const fetcher = new Fetcher({
 *   baseURL: "https://api.example.com",
 *   headers: {
 *     "Authorization": "Bearer token",
 *     "Content-Type": "application/json"
 *   },
 *   timeout: 5000, // 5 seconds
 *   retries: 3 // Retry failed requests up to 3 times
 * });
 */
export default class Fetcher {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  timeout: number = 6000; // Default timeout of 60 seconds
  retries: number = 0;
  credentials?: RequestCredentials;

  private requestInterceptor?: RequestInterceptor;
  private responseInterceptor?: ResponseInterceptor;

  /**
   * Interceptors for modifying requests and responses.
   * - `request`: Interceptor for modifying request configuration.
   * - `response`: Interceptor for modifying response before returning.
   */
  interceptors = {
    request: {
      /**
       * @param fn - The request interceptor function to modify requests.
       * This function will be called with the RequestInit object before the request is sent.
       * It can modify the request configuration or return a new one.
       * @example
       * fetcher.interceptors.request.use((config) => {
       *   // Add an authorization header
       *   config.headers['Authorization'] = 'Bearer token';
       *   return config;
       * });
       */
      use: (fn: RequestInterceptor) => {
        this.requestInterceptor = fn;
      },
    },
    response: {
      /**
       * @param fn - The response interceptor function to modify responses.
       * This function will be called with the Response object before it is returned.
       * It can modify the response or return a new one.
       * @example
       * fetcher.interceptors.response.use((response) => {
       *   // Modify the response here
       *   if (response.status === 404) {
       *     throw new Error("Resource not found");
       *   }
       *   return response;
       * });
       */
      use: (fn: ResponseInterceptor) => {
        this.responseInterceptor = fn;
      },
    },
  };

  constructor(config: FetcherConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 0;
    this.retries = config.retries || 0;
    this.credentials = config.credentials;
  }

  private async handleResponse(response: Response): Promise<Response> {
    if (this.responseInterceptor) {
      return await this.responseInterceptor(response.clone());
    }
    return response;
  }

  private mergeHeaders(configHeaders?: HeadersInit): HeadersInit {
    return {
      ...this.defaultHeaders,
      ...(configHeaders || {}),
    };
  }

  /**
   * Performs a raw HTTP request.
   * @param url - The request path relative to baseURL.
   * @param config - Request configuration.
   * @returns A Promise resolving to the Response.
   * @example
   * fetcher.request('/users', {
   *   method: 'GET',
   *   headers: { 'Authorization': 'Bearer token' },
   *   timeout: 5000, // Override default timeout
   *   retries: 3, // Retry failed requests up to 3 times
   * })
   *   .then(response => response.json())
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.request('/users', {
   *   method: 'POST',
   *   body: JSON.stringify({ name: 'John Doe' }),
   *   headers: { 'Content-Type': 'application/json' },
   * })
   *   .then(response => response.json())
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async request(url: string, config: RequestConfig = {}): Promise<Response> {
    let finalConfig: RequestInit = {
      ...config,
      headers: this.mergeHeaders(config.headers),
    };
    if (this.credentials) {
      finalConfig.credentials = this.credentials;
    }
    if (this.requestInterceptor) {
      finalConfig = await this.requestInterceptor(finalConfig);
    }

    const fullUrl = this.baseURL + url;
    try {
      const response = await fetchTransport({
        url: fullUrl,
        config: finalConfig,
        timeout: config.timeout ?? this.timeout,
        retries: config.retries ?? this.retries,
      });
      return this.handleResponse(response);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw err;
    }
  }

  /**
   * Performs a GET request and parses JSON.
   * @param url - The request path.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the parsed JSON data.
   * @example
   * fetcher.get('/users')
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { headers: { 'Authorization': 'Bearer token' } })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { timeout: 5000 }) // Override default timeout
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { retries: 3 }) // Retry failed requests up to 3 times
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { method: 'GET' }) // Explicitly set the method
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { body: null }) // No body for GET requests
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { headers: { 'Accept': 'application/json' } }) // Set Accept header
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { headers: { 'X-Custom-Header': 'value' } }) // Custom headers
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.get('/users', { headers: { 'Content-Type': 'application/json' } }) // Set Content-Type header
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async get<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
    const response = await this.request(url, { ...config, method: 'GET' });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response.json() as Promise<T>;
  }

  /**
   * Performs a POST request with a JSON body.
   * @param url - The request path.
   * @param body - The JSON payload.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the parsed JSON response.
   * @example
   * fetcher.post('/users', { name: 'John Doe' })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.post('/users', { name: 'John Doe' }, { headers: { 'Authorization': 'Bearer token' } })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.post('/users', { name: 'John Doe' }, { timeout: 5000 }) // Override default timeout
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.post('/users', { name: 'John Doe' }, { retries: 3 }) // Retry failed requests up to 3 times
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.post('/users', { name: 'John Doe' }, { method: 'POST' }) // Explicitly set the method
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async post<T = unknown>(
    url: string,
    body: unknown | Record<string, unknown> | FormData,
    config: RequestConfig = {},
  ): Promise<T> {
    const response = await this.request(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.mergeHeaders(config.headers),
      },
    });
    return response.json() as Promise<T>;
  }

  /**
   * Performs a PUT request with a JSON body.
   * @param url - The request path.
   * @param body - The JSON payload.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the parsed JSON response.
   * @example
   * fetcher.put('/users/1', { name: 'Jane Doe' })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.put('/users/1', { name: 'Jane Doe' }, {
   *   headers: { 'Authorization': 'Bearer token' }
   * })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.put('/users/1', { name: 'Jane Doe' }, {
   *   timeout: 5000 // Override default timeout
   * })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.put('/users/1', { name: 'Jane Doe' }, {
   *   retries: 3 // Retry failed requests up to 3 times
   * })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async put<T = unknown>(
    url: string,
    body: unknown | Record<string, unknown> | FormData,
    config: RequestConfig = {},
  ): Promise<T> {
    const response = await this.request(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.mergeHeaders(config.headers),
      },
    });
    return response.json() as Promise<T>;
  }

  /**
   * Performs a DELETE request.
   * @param url - The request path.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the parsed JSON response.
   * @example
   * fetcher.delete('/users/1')
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.delete('/users/1', { headers: { 'Authorization': 'Bearer token' } })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.delete('/users/1', { timeout: 5000 }) // Override default timeout
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.delete('/users/1', { retries: 3 }) // Retry failed requests up to 3 times
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.delete('/users/1', { method: 'DELETE' }) // Explicitly set the method
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async delete<T = unknown>(
    url: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const response = await this.request(url, { ...config, method: 'DELETE' });
    return response.json() as Promise<T>;
  }

  /**
   * Downloads a file while reporting progress.
   * @param url - The request path.
   * @param onProgress - Callback for download progress.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the Blob of the downloaded data.
   * @example
   * fetcher.downloadWithProgress('/file.zip', (loaded, total) => {
   *   console.log(`Downloaded ${loaded} bytes of ${total} bytes`);
   * })
   *   .then(blob => {
   *     // Handle the downloaded Blob (e.g., save it)
   *     const url = URL.createObjectURL(blob);
   *     const a = document.createElement('a');
   *     a.href = url;
   *     a.download = 'file.zip';
   *     document.body.appendChild(a);
   *     a.click();
   *     document.body.removeChild(a);
   *   })
   *   .catch(err => console.error(err));
   * @example
   * fetcher.downloadWithProgress('/file.zip', (loaded, total) => {
   *   console.log(`Downloaded ${loaded} bytes of ${total} bytes`);
   * }, {
   *   timeout: 5000 // Override default timeout
   * })
   */
  async downloadWithProgress(
    url: string,
    onProgress: (loaded: number, total: number | null) => void,
    config: RequestConfig = {},
  ): Promise<Blob> {
    const fullUrl = this.baseURL + url;

    const response = await fetchTransport({
      url: fullUrl,
      config: {
        ...config,
        method: 'GET',
        headers: this.mergeHeaders(config.headers),
      },
      timeout: config.timeout ?? this.timeout,
      retries: config.retries ?? this.retries,
      onDownloadProgress: onProgress,
    });

    return response.blob();
  }

  /**
   * Performs a POST request with upload progress reporting using XHR.
   * @param url - The request path.
   * @param body - The payload to upload.
   * @param onUploadProgress - Callback for upload progress.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the parsed JSON response.
   * @example
   * fetcher.postWithUploadProgress('/upload', formData, (event) => {
   *   const percent = Math.round((event.loaded * 100) / event.total);
   *   console.log(`Upload progress: ${percent}%`);
   * })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   * @example
   * fetcher.postWithUploadProgress('/upload', formData, (event) => {
   *   const percent = Math.round((event.loaded * 100) / event.total);
   *   console.log(`Upload progress: ${percent}%`);
   * }, {
   *   timeout: 5000 // Override default timeout
   * })
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async postWithUploadProgress<T = unknown>(
    url: string,
    body: FormData | Blob | string,
    onUploadProgress: (event: ProgressEvent) => void,
    config: RequestConfig = {},
  ): Promise<T> {
    const fullUrl = this.baseURL + url;

    const response = await xhrTransport({
      url: fullUrl,
      method: 'POST',
      headers: this.mergeHeaders(config.headers) as Record<string, string>,
      body,
      timeout: config.timeout ?? this.timeout,
      onUploadProgress,
    });

    return response.json() as Promise<T>;
  }
}

export type {
  FetcherConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
};

/**
 * Fetcher provides a universal HTTP client that supports fetch and XHR fallback.
 * Use it to perform HTTP requests with retries, timeouts, interceptors, and progress reporting.
 */
import { fetchTransport } from './transports/fetchTransport';
import { xhrTransport } from './transports/xhrTransport';
import type {
  FetcherConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  Interceptors,
} from './types';

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
  /**
   * The base URL for all requests.
   * This is prepended to the request path when making requests.
   * @type {string}
   */
  baseURL: string;
  /**
   * Default headers to include in every request.
   * These headers will be merged with any headers provided in individual requests.
   * @type {Record<string, string>}
   */
  defaultHeaders: Record<string, string>;
  /**
   * Default timeout for requests in milliseconds.
   * If a request takes longer than this time, it will be aborted.
   * @type {number}
   */
  timeout: number = 6000; // Default timeout of 6 seconds
  /**
   * Number of times to retry failed requests.
   * If a request fails, it will be retried this many times before throwing an error.
   * @type {number}
   */
  retries: number = 0;
  /**
   * Credentials mode for requests.
   * - 'same-origin': Send cookies for same-origin requests.
   * - 'include': Always send cookies, even for cross-origin requests.
   * - 'omit': Never send cookies.
   * @type {RequestCredentials}
   */
  credentials?: RequestCredentials;

  private requestInterceptor?: RequestInterceptor;
  private responseInterceptor?: ResponseInterceptor;

  /**
   * Interceptors for modifying requests and responses.
   * This object provides methods to register request and response interceptors.
   * @type {Interceptors}
   */
  interceptors: Interceptors = {
    /**
     * Middleware for request interceptors.
     * This allows you to register functions that modify the request before it is sent.
     * @type {RequestInterceptorMiddleware}
     */
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
    /**
     * Middleware for response interceptors.
     * This allows you to register functions that modify the response after it is received.
     * @type {ResponseInterceptorMiddleware}
     */
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
   * @returns A Promise resolving to the Response object.
   * @example
   * fetcher.request('/users', {
   *   method: 'GET',
   *   headers: {
   *     'Authorization': 'Bearer token'
   *   },
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
   * @returns A Promise resolving to the Response.
   * @example
   * fetcher.get('/users')
   *   .then(response => response.json())
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async get(url: string, config: RequestConfig = {}): Promise<Response> {
    return this.request(url, { ...config, method: 'GET' });
  }

  /**
   * Performs a POST request with a JSON body.
   * @param url - The request path.
   * @param body - The JSON payload.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the Response.
   * @example
   * fetcher.post('/users', { name: 'John Doe' })
   *   .then(response => response.json())
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async post(
    url: string,
    body: unknown | Record<string, unknown> | FormData,
    config: RequestConfig = {},
  ): Promise<Response> {
    return this.request(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.mergeHeaders(config.headers),
      },
    });
  }

  /**
   * Performs a PUT request with a JSON body.
   * @param url - The request path.
   * @param body - The JSON payload.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the response.
   */
  async put(
    url: string,
    body: unknown | Record<string, unknown> | FormData,
    config: RequestConfig = {},
  ): Promise<Response> {
    return this.request(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...this.mergeHeaders(config.headers),
      },
    });
  }

  /**
   * Performs a DELETE request.
   * @param url - The request path.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the Response.
   * @example
   * fetcher.delete('/users/1')
   *   .then(response => console.log('Deleted successfully'))
   *   .catch(err => console.error(err));
   */
  async delete(url: string, config: RequestConfig = {}): Promise<Response> {
    return this.request(url, { ...config, method: 'DELETE' });
  }

  /**
   * Downloads a file while reporting progress.
   * @param url - The request path.
   * @param onProgress - Callback for download progress.
   * @param config - Optional request configuration.
   * @returns A Promise resolving to the downloaded Blob.
   * @example
   * fetcher.downloadWithProgress('/file.zip', (loaded, total) => {
   *   const percentComplete = total ? (loaded / total) * 100 : 0;
   *   console.log(`Download progress: ${percentComplete}%`);
   * })
   *   .then(blob => {
   *     const url = URL.createObjectURL(blob);
   *     const a = document.createElement('a');
   *     a.href = url;
   *     a.download = 'file.zip';
   *     document.body.appendChild(a);
   *     a.click();
   *     document.body.removeChild(a);
   *   })
   *   .catch(err => console.error(err));
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
   * @returns A Promise resolving to the Response.
   * @example
   * fetcher.postWithUploadProgress('/upload', formData, (event) => {
   *   const percentComplete = (event.loaded / event.total) * 100;
   *   console.log(`Upload progress: ${percentComplete}%`);
   * })
   *   .then(response => response.json())
   *   .then(data => console.log(data))
   *   .catch(err => console.error(err));
   */
  async postWithUploadProgress(
    url: string,
    body: FormData | Blob | string,
    onUploadProgress: (event: ProgressEvent) => void,
    config: RequestConfig = {},
  ): Promise<Response> {
    const fullUrl = this.baseURL + url;

    return xhrTransport({
      url: fullUrl,
      method: 'POST',
      headers: this.mergeHeaders(config.headers) as Record<string, string>,
      body,
      timeout: config.timeout ?? this.timeout,
      onUploadProgress,
    });
  }
}

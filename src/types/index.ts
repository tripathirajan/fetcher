/**
 * @interface FetcherConfig
 * @public
 * Configuration options for the Fetcher.
 * This interface allows you to set the base URL, default headers, timeout, retries, and credentials mode.
 * It is used to initialize the Fetcher instance.
 * @property {string} [baseURL] - The base URL for all requests. Defaults to an empty string.
 * @property {Record<string, string>} [headers] - Default headers to include in every request.
 * Defaults to an empty object.
 * @property {number} [timeout] - Default timeout for requests in milliseconds. Defaults to 6000 (6 seconds).
 * @property {number} [retries] - Number of times to retry failed requests.
 * Defaults to 0 (no retries).
 * @property {RequestCredentials} [credentials] - Credentials mode for requests.
 * Possible values are 'same-origin', 'include', and 'omit'.
 * Defaults to 'same-origin'.
 * - 'same-origin': Send cookies for same-origin requests.
 * - 'include': Always send cookies, even for cross-origin requests.
 * - 'omit': Never send cookies.
 */
export interface FetcherConfig {
  /**
   * The base URL for all requests.
   * @default ''
   */
  baseURL?: string;
  /**
   * Default headers to include in every request.
   * @default {}
   */
  headers?: Record<string, string>;
  /**
   * Default timeout for requests in milliseconds.
   * @default 6000 (6 seconds)
   */
  timeout?: number;
  /**
   * Number of times to retry failed requests.
   * @default 0 (no retries)
   */
  retries?: number;
  /**
   * Credentials mode for requests.
   * - 'same-origin': Send cookies for same-origin requests.
   * - 'include': Always send cookies, even for cross-origin requests.
   * - 'omit': Never send cookies.
   * @default 'same-origin'
   */
  credentials?: RequestCredentials;
}
/**
 * Configuration for an individual request, extending RequestInit.
 * Includes optional timeout and retries.
 * @public
 */
export interface RequestConfig extends RequestInit {
  /**
   * Timeout for the request in milliseconds.
   * If set, the request will be aborted if it takes longer than this time.
   * @default 6000 (6 seconds)
   */
  timeout?: number;
  /**
   * Number of times to retry the request if it fails.
   * If set, the request will be retried this many times before failing.
   * @default 0 (no retries)
   */
  retries?: number;
}

/**
 * A function to intercept and modify the request before it is sent.
 * @public
 * @param config - The RequestInit object containing request configuration.
 * @returns A Promise resolving to the modified RequestInit object or the original one.
 */
export type RequestInterceptor = (
  config: RequestInit,
) => Promise<RequestInit> | RequestInit;

/**
 * A function to intercept and modify the response after it is received.
 * @public
 * @param response - The Response object containing the response data.
 * @returns A Promise resolving to the modified Response object or the original one.
 */
export type ResponseInterceptor = (
  response: Response,
) => Promise<Response> | Response;

/**
 * Middleware interface for request interceptors.
 * This interface defines a method to register request interceptors.
 * @public
 * @interface RequestInterceptorMiddleware
 * @property {function} use - Method to register a request interceptor function.
 * @param {RequestInterceptor} fn - The request interceptor function to register.
 * The function should accept a RequestInit object and return a modified or original RequestInit object.
 */
export interface RequestInterceptorMiddleware {
  /**
   * Method to register a request interceptor function.
   * @param fn - The request interceptor function to register.
   * The function should accept a RequestInit object and return a modified or original RequestInit object.
   */
  use: (fn: RequestInterceptor) => void;
}

/**
 * Middleware interface for response interceptors.
 * This interface defines a method to register response interceptors.
 * @public
 * @interface ResponseInterceptorMiddleware
 * @property {function} use - Method to register a response interceptor function.
 * @param {ResponseInterceptor} fn - The response interceptor function to register.
 * The function should accept a Response object and return a modified or original Response object.
 */
export interface ResponseInterceptorMiddleware {
  /**
   * Method to register a response interceptor function.
   * @param fn - The response interceptor function to register.
   * The function should accept a Response object and return a modified or original Response object.
   */
  use: (fn: ResponseInterceptor) => void;
}

/**
 * Interceptors for modifying requests and responses.
 * This interface defines methods to register request and response interceptors.
 * @public
 */
export interface Interceptors {
  /**
   * Middleware for request interceptors.
   * This allows you to register functions that modify the request before it is sent.
   */
  request: RequestInterceptorMiddleware;
  /**
   * Middleware for response interceptors.
   * This allows you to register functions that modify the response after it is received.
   */
  response: ResponseInterceptorMiddleware;
}

/**
 * Options for the Fetch transport.
 * This interface defines the options for making HTTP requests using the Fetch API.
 * It includes the URL, request configuration, optional timeout, retries, and a callback for download progress.
 * @public
 */

export interface FetchTransportOptions {
  /**
   * The URL for the request.
   * This is the endpoint to which the request will be sent.
   * It can be a full URL or a relative path if a base URL is set in the FetcherConfig.
   * @example 'https://api.example.com/data'
   * @public
   * @type {string}
   */
  url: string;
  /**
   * The configuration for the request, extending RequestInit.
   * This includes method, headers, body, and other options.
   * @example { method: 'GET', headers: { 'Content-Type': 'application/json' } }
   * @public
   * @type {RequestInit}
   */
  config: RequestInit;
  /**
   * Optional timeout for the request in milliseconds.
   * If set, the request will be aborted if it takes longer than this time.
   * @default 6000 (6 seconds)
   * @public
   * @type {number}
   */
  timeout?: number;
  /**
   * Number of times to retry the request if it fails.
   * If set, the request will be retried this many times before failing.
   * @default 0 (no retries)
   * @public
   * @type {number}
   */
  retries?: number;
  /**
   * Callback function to track download progress.
   * This function will be called with the number of bytes loaded and the total size of the response.
   * @public
   * @type {(loaded: number, total: number | null) => void}
   */
  onDownloadProgress?: (loaded: number, total: number | null) => void;
}

/**
 * Options for the XHR transport.
 * This interface defines the options for making HTTP requests using XMLHttpRequest.
 * It includes the URL, method, headers, body, timeout, and callbacks for download and upload progress.
 * @public
 * @interface XhrTransportOptions
 * @property {string} url - The URL for the request.
 * @property {string} method - The HTTP method for the request (e.g., 'GET', 'POST').
 * @property {Record<string, string>} [headers] - Headers to include in the request.
 * @property {Document | XMLHttpRequestBodyInit | null} [body] - The body of the request.
 * @property {number} [timeout] - Optional timeout for the request in milliseconds.
 * @property {(event: ProgressEvent) => void} [onDownloadProgress] - Callback for download progress.
 * @property {(event: ProgressEvent) => void} [onUploadProgress] - Callback for upload progress.
 * @property {RequestCredentials} [credentials] - Credentials mode for the request.
 * @default { timeout: 6000, credentials: 'same-origin' }
 * @example
 * {
 *   url: 'https://api.example.com/data',
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ key: 'value' }),
 *   timeout: 6000,
 *   onDownloadProgress: (event) => console.log(`Downloaded ${event.loaded} bytes`),
 *   onUploadProgress: (event) => console.log(`Uploaded ${event.loaded} bytes`),
 *   credentials: 'same-origin'
 * }
 */
export interface XhrTransportOptions {
  /**
   * The URL for the request.
   * This is the endpoint to which the request will be sent.
   * It can be a full URL or a relative path if a base URL is set in the FetcherConfig.
   * @example 'https://api.example.com/data'
   * @public
   * @type {string}
   */
  url: string;
  /**
   * The HTTP method for the request.
   * This specifies the type of request to be made, such as 'GET', 'POST', 'PUT', etc.
   * @example 'GET'
   * @public
   * @type {string}
   */
  method: string;
  /**
   * Headers to include in the request.
   * This is an object containing key-value pairs representing the headers to be sent with the request.
   * @example { 'Content-Type': 'application/json' }
   * @public
   * @type {Record<string, string>}
   */
  headers?: Record<string, string>;
  /**
   * The body of the request.
   * This can be a Document, XMLHttpRequestBodyInit, or null for requests without a body.
   * @example JSON.stringify({ key: 'value' })
   * @public
   * @type {Document | XMLHttpRequestBodyInit | null}
   */
  body?: Document | XMLHttpRequestBodyInit | null;
  /**
   * Optional timeout for the request in milliseconds.
   * If set, the request will be aborted if it takes longer than this time.
   * @default 6000 (6 seconds)
   * @public
   * @type {number}
   */
  timeout?: number;
  /**
   * Callback function to track download progress.
   * This function will be called with the ProgressEvent object containing information about the download progress.
   * @public
   * @type {(event: ProgressEvent) => void}
   */
  onDownloadProgress?: (event: ProgressEvent) => void;
  /**
   * Callback function to track upload progress.
   * This function will be called with the ProgressEvent object containing information about the upload progress.
   * @public
   * @type {(event: ProgressEvent) => void}
   */
  onUploadProgress?: (event: ProgressEvent) => void;
  /**
   * Credentials mode for the request.
   * This specifies whether to send cookies and HTTP authentication information with the request.
   * Possible values are 'same-origin', 'include', and 'omit'.
   * @default 'same-origin'
   * @public
   * @type {RequestCredentials}
   */
  credentials?: RequestCredentials; // Optional credentials mode
  // e.g., 'same-origin', 'include', 'omit'
}

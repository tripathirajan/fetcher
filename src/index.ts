import Fetcher, {
  FetcherConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './Fetcher';

/**
 * A default Fetcher instance that can be used directly.
 * This instance is pre-configured with default settings.
 * @example
 * fetcher('/api/data')
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
const defaultInstance = new Fetcher();

/**
 * Create a new Fetcher instance with the given configuration.
 * @param url The URL to fetch.
 * @param config The configuration options for the request.
 * @returns A Promise that resolves to the response.
 * @example
 * fetcher('/users', { method: 'GET' })
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
function fetcher(url: string, config?: RequestConfig) {
  return defaultInstance.request(url, config);
}

// Attach all methods
fetcher.get = defaultInstance.get.bind(defaultInstance);
fetcher.post = defaultInstance.post.bind(defaultInstance);
fetcher.put = defaultInstance.put.bind(defaultInstance);
fetcher.delete = defaultInstance.delete.bind(defaultInstance);
fetcher.downloadWithProgress =
  defaultInstance.downloadWithProgress.bind(defaultInstance);
fetcher.postWithUploadProgress =
  defaultInstance.postWithUploadProgress.bind(defaultInstance);
fetcher.interceptors = defaultInstance.interceptors;

/**
 * Create a new Fetcher instance with the given configuration.
 * @param config The configuration options for the Fetcher instance.
 * @returns A new Fetcher instance.
 * @example
 * const client = fetcher.create({ baseURL: 'https://api.example.com' });
 * client.get('/endpoint')
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
fetcher.create = (config: FetcherConfig) => new Fetcher(config);

/**
 * A Fetcher instance that can be used directly.
 * This instance is pre-configured with default settings.
 * @example
 * fetcher('/api/data')
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
export default fetcher;

export { Fetcher };
export type {
  FetcherConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
};

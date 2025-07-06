/**
 * @module fetcher
 *
 * A modern HTTP client supporting fetch and XHR fallback.
 * Provides a simple API for making requests with support for interceptors, retries, and more.
 * @example
 * import fetcher from 'fetcher';
 * const client = fetcher.create({ baseURL: 'https://api.example.com' });
 * client.get('/endpoint')
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
// @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

import Fetcher, {
  FetcherConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './Fetcher';

function create(config: FetcherConfig) {
  return new Fetcher(config);
}
const fetcher = { create };

export default fetcher;

export { Fetcher };
export type {
  FetcherConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
};

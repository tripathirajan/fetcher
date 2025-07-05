/**
 * @module fetcher
 *
 * A modern HTTP client supporting fetch and XHR fallback.
 *
 * ## Example
 *
 * ```typescript
 * import fetcher from 'fetcher';
 *
 * const api = fetcher.create({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000,
 *   retries: 3,
 * });
 *
 * // Perform a GET request
 * api.get('/users')
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 *
 * // Download with progress
 * api.downloadWithProgress('/file.zip', (loaded, total) => {
 *   console.log(`Downloaded ${loaded}/${total}`);
 * });
 * ```
 *
 * ## Features
 * - Automatic retries and timeouts
 * - Request/response interceptors
 * - Download and upload progress
 * - Node and browser support
 */
import Fetcher, { FetcherConfig } from "./Fetcher";

function create(config: FetcherConfig) {
  return new Fetcher(config);
}

export default {
  create,
};

export { Fetcher };
export type { FetcherConfig };

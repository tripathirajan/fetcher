/**
 * Retries an asynchronous function up to a specified number of times.
 *
 * @template T The type of the resolved value.
 * @param fn The function returning a promise.
 * @param retries The number of retry attempts.
 * @returns A promise that resolves with the function result or rejects after all retries fail.
 */
export async function withRetries<T>(
  fn: () => Promise<T>,
  retries: number,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) {
        throw err;
      }
      attempt++;
    }
  }
}

/**
 * Wraps a promise with a timeout.
 *
 * @template T The type of the resolved value.
 * @param promise The promise to wrap.
 * @param ms The timeout in milliseconds.
 * @returns A promise that rejects if the timeout elapses before the original promise settles.
 */
export function withTimeout<T>(promise: Promise<T>, ms?: number): Promise<T> {
  if (!ms) return promise;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timeoutId);
      return res;
    }),
    new Promise<T>((_, reject) =>
      controller.signal.addEventListener('abort', () =>
        reject(new Error(`Request timed out after ${ms} ms`)),
      ),
    ),
  ]);
}

/**
 * Custom error class for HTTP errors.
 * It extends the built-in Error class and includes additional properties
 * for status code, status text, and error type.
 * @class HttpError
 * @extends {Error}
 * @property {number} status - The HTTP status code.
 * @property {string} statusText - The HTTP status text.
 * @property {string} type - The type of error, default is 'HTTP'.
 */
class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public type: string = 'HTTP',
  ) {
    super('HttpError');
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.type = type;
  }
}

export default HttpError;

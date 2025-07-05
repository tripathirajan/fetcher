import { describe, it, expect } from 'vitest';
import { withTimeout } from '../src/utils';

describe('withTimeout', () => {
  it('resolves before timeout', async () => {
    const promise = Promise.resolve('done');
    const result = await withTimeout(promise, 1000);
    expect(result).toBe('done');
  });

  it('rejects after timeout', async () => {
    const promise = new Promise((resolve) =>
      setTimeout(() => resolve('late'), 200),
    );
    await expect(withTimeout(promise, 50)).rejects.toThrow(
      'Request timed out after 50 ms',
    );
  });

  it('does not timeout when ms is undefined', async () => {
    const promise = Promise.resolve('no timeout');
    const result = await withTimeout(promise);
    expect(result).toBe('no timeout');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { withRetries } from '../src/utils';

describe('Utils > withRetries', () => {
  it('resolves on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetries(fn, 3);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('retries and succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    const result = await withRetries(fn, 3);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('fails after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    await expect(withRetries(fn, 2)).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

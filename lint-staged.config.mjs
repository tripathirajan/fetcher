export default {
  '*.{ts}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};

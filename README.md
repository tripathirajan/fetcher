<p align="center">
  <img src="https://raw.githubusercontent.com/tripathirajan/fetcher/main/assets/logo.PNG" width="120" alt="Fetcher logo" />
</p>

# @tripathirajan/fetcher

![npm](https://img.shields.io/npm/v/@tripathirajan/fetcher)
![License](https://img.shields.io/github/license/tripathirajan/fetcher)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/@tripathirajan/fetcher@1.0.1-beta.1)](https://bundlephobia.com/package/@tripathirajan/fetcher@1.0.1-beta.1)

A modern, universal HTTP client library for TypeScript and JavaScript that supports fetch and XHR fallback, timeouts, retries, interceptors, and progress reporting.

## 📊 Feature Support

| Feature                    | Browser | Node.js |
| -------------------------- | :-----: | :-----: |
| `fetcher.get/post/...`     |   ✅    |   ✅    |
| `downloadWithProgress()`   |   ✅    |   ❌    |
| `postWithUploadProgress()` |   ✅    |   ❌    |

## ✨ Quickstart

```typescript
import fetcher from '@tripathirajan/fetcher';
const res = await fetcher.get('https://api.example.com/data');
const json = await res.json();
```

## 📦 Features

- Automatic retries and timeouts
- Request and response interceptors
- Download and upload progress
- Node.js and browser support
- ESM, CJS, and IIFE builds

## 📥 Installation

```bash
npm install @tripathirajan/fetcher
```

## 🚀 Usage Examples

### ESM (Node.js or Bundlers)

```typescript
import fetcher from '@tripathirajan/fetcher';
// example usage here...
```

### CommonJS

```javascript
const fetcher = require('@tripathirajan/fetcher').default;
// example usage here...
```

### IIFE (Browser)

```html
<script src="https://unpkg.com/@tripathirajan/fetcher@<VERSION>/dist/fetcher.min.js"></script>
<script>
  fetcher
    .get('https://api.example.com/data')
    .then((res) => res.json())
    .then((data) => console.log(data));
</script>
```

## ⚙️ API Reference

### `fetcher.create(config)`

Creates a new Fetcher instance.

#### Config Options

| Option        | Type                                   | Description                                 |
| ------------- | -------------------------------------- | ------------------------------------------- |
| `baseURL`     | `string`                               | Base URL for all requests                   |
| `headers`     | `Record<string, string>`               | Default headers                             |
| `timeout`     | `number`                               | Timeout in milliseconds                     |
| `retries`     | `number`                               | Number of retry attempts                    |
| `credentials` | `"omit" \| "same-origin" \| "include"` | Credential policy for cross-origin requests |

### Methods

All methods return a native `Response` object. You must call `.json()`, `.text()`, etc. to parse.

- `get(url, config?)`
- `post(url, body, config?)`
- `put(url, body, config?)`
- `delete(url, config?)`
- `downloadWithProgress(url, onProgress, config?)` _(Browser only)_
- `postWithUploadProgress(url, body, onUploadProgress, config?)` _(Browser only)_

## 📚 Documentation

Full API documentation:

[https://tripathirajan.github.io/fetcher/](https://tripathirajan.github.io/fetcher/)

## 🌐 Supported Environments

> ⚠️ `downloadWithProgress` and `postWithUploadProgress` are only available in browser environments and will throw an error if used in Node.js.

- Node.js 16+
- All modern browsers
- Internet Explorer 11 (with polyfills for Fetch/XHR)

## 📂 Examples

See the [`examples`](./examples) folder for Node.js and Browser usage.

## 🛠️ Development

Run all pre-checks before build:

```bash
npm run prebuild
```

> Note: The `prebuild` script runs automatically before `npm run build`.
> It ensures linting, formatting, and tests are successful before generating build output.

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a pull request.

## 💖 Support

If you find this library useful, consider starring the repo or [buying me a coffee](https://buymeacoffee.com/tripathirajan).

## 🧩 License

MIT © 2025 Rajan Tripathi

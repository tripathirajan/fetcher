# @tripathirajan/fetcher

![npm](https://img.shields.io/npm/v/@tripathirajan/fetcher)
![License](https://img.shields.io/github/license/tripathirajan/fetcher)
![Bundle size](https://bundlephobia.com/package/@tripathirajan/fetcher)

A modern, universal HTTP client library for TypeScript and JavaScript that supports fetch and XHR fallback, timeouts, retries, interceptors, and progress reporting.

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
<script src="https://unpkg.com/@tripathirajan/fetcher/dist/fetcher.min.js"></script>
<script>
  // example usage here...
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
- `downloadWithProgress(url, onProgress, config?)`
- `postWithUploadProgress(url, body, onUploadProgress, config?)`

## 📚 Documentation

Full API documentation:

[https://tripathirajan.github.io/fetcher/](https://tripathirajan.github.io/fetcher/)

## 🌐 Supported Environments

- Node.js 16+
- All modern browsers
- Internet Explorer 11 (with polyfills for Fetch/XHR)

## 📂 Examples

See the [`examples`](./examples) folder for Node.js and Browser usage.

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a pull request.

## 💖 Support

If you find this library useful, consider starring the repo or [buying me a coffee](https://buymeacoffee.com/tripathirajan).

## 🧩 License

MIT © 2024 Rajan Tripathi

# @tripathirajan/fetcher

![npm version](https://img.shields.io/npm/v/fetcher)
![License](https://img.shields.io/github/license/tripathirajan/fetcher)

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage Examples](#-usage-examples)
  - [ESM](#esm-nodejs-or-bundlers)
  - [CommonJS](#commonjs)
  - [IIFE (Browser)](#iife-browser)
- [API Reference](#️-api-reference)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Supported Environments](#-supported-environments)
- [License](#-license)

A modern, universal HTTP client library for TypeScript and JavaScript that supports fetch and XHR fallback, timeouts, retries, interceptors, and progress reporting.

## ✨ Features

- Automatic retries and timeouts
- Request and response interceptors
- Download and upload progress
- Node.js and browser support
- ESM, CJS, and IIFE builds

## 📦 Installation

```bash
npm install @tripathirajan/fetcher
```

## 🚀 Usage Examples

### ESM (Node.js or Bundlers)

```typescript
import fetcher from '@tripathirajan/fetcher';

const api = fetcher.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 2,
  credentials: 'include',
});

api.get('/users').then(async (res) => {
  const data = await res.json();
  console.log('GET response:', data);
});

api.post('/users', { name: 'Alice' }).then(async (res) => {
  const data = await res.json();
  console.log('POST response:', data);
});
```

### CommonJS

```javascript
const fetcher = require('@tripathirajan/fetcher').default;

const api = fetcher.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 2,
});

api.get('/products').then(async (res) => {
  const data = await res.json();
  console.log('CJS response:', data);
});
```

### IIFE (Browser)

After publishing, you can include the UMD/IIFE build via a CDN like unpkg:

```html
<script src="https://unpkg.com/@tripathirajan/fetcher/dist/fetcher.min.js"></script>
<script>
  const api = fetcher.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
  });

  api.get('/users').then(async (res) => {
    const data = await res.json();
    console.log('IIFE GET response:', data);
  });

  api.post('/users', { name: 'Alice' }).then(async (res) => {
    const data = await res.json();
    console.log('IIFE POST response:', data);
  });

  api.downloadWithProgress('/file.zip', (loaded, total) => {
    console.log(`Downloaded ${loaded}/${total}`);
  });
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

All methods return a native `Response` object.
You must call `.json()`, `.text()`, or other methods to parse.

- `get(url, config?)`: GET request returning `Response`
- `post(url, body, config?)`: POST request returning `Response`
- `put(url, body, config?)`: PUT request returning `Response`
- `delete(url, config?)`: DELETE request returning `Response`
- `downloadWithProgress(url, onProgress, config?)`: Download file with progress
- `postWithUploadProgress(url, body, onUploadProgress, config?)`: POST with upload progress (XHR)

## 📚 Documentation

Full API documentation is available at:

[https://tripathirajan.github.io/fetcher/](https://tripathirajan.github.io/fetcher/)

## ✨ Quickstart

```typescript
import fetcher from '@tripathirajan/fetcher';
const res = await fetcher.get('https://api.example.com/data');
const json = await res.json();
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a pull request.

## 🌐 Supported Environments

- Node.js 16+
- All modern browsers
- Internet Explorer 11 (with polyfills for Fetch/XHR)

## 🧩 License

MIT © 2024 Rajan Tripathi

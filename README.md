

# @tripathirajan/fetcher

A modern, universal HTTP client library for TypeScript and JavaScript that supports fetch and XHR fallback, timeouts, retries, interceptors, and progress reporting.

## ✨ Features

- Automatic retries and timeouts
- Request and response interceptors
- Download and upload progress
- Node.js and browser support
- ESM, CJS, and IIFE builds

## 📦 Installation

```bash
npm install fetcher
```

## 🚀 Usage Examples

### ESM (Node.js or Bundlers)

```typescript
import fetcher from "fetcher";

const api = fetcher.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  retries: 2,
  credentials: "include",
});

api.get("/users").then((data) => console.log("GET response:", data));

api.post("/users", { name: "Alice" }).then((data) =>
  console.log("POST response:", data)
);
```

### CommonJS

```javascript
const fetcher = require("fetcher").default;

const api = fetcher.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  retries: 2,
});

api.get("/products").then((data) => console.log("CJS response:", data));
```

### IIFE (Browser)

After publishing, you can include the UMD/IIFE build via a CDN like unpkg:

```html
<script src="https://unpkg.com/fetcher/dist/index.js"></script>
<script>
  const api = fetcher.create({
    baseURL: "https://api.example.com",
    timeout: 5000,
  });

  api.get("/users").then((data) => {
    console.log("IIFE GET response:", data);
  });

  api.post("/users", { name: "Alice" }).then((data) => {
    console.log("IIFE POST response:", data);
  });

  api.downloadWithProgress("/file.zip", (loaded, total) => {
    console.log(`Downloaded ${loaded}/${total}`);
  });
</script>
```

## ⚙️ API Reference

### `fetcher.create(config)`

Creates a new Fetcher instance.

#### Config Options

| Option        | Type                           | Description                                             |
|---------------|--------------------------------|---------------------------------------------------------|
| `baseURL`     | `string`                       | Base URL for all requests                               |
| `headers`     | `Record<string, string>`       | Default headers                                         |
| `timeout`     | `number`                       | Timeout in milliseconds                                 |
| `retries`     | `number`                       | Number of retry attempts                                |
| `credentials` | `"omit" \| "same-origin" \| "include"` | Credential policy for cross-origin requests            |

### Methods

- `get<T>(url, config?)`: GET request returning JSON
- `post<T>(url, body, config?)`: POST request with JSON
- `put<T>(url, body, config?)`: PUT request with JSON
- `delete<T>(url, config?)`: DELETE request returning JSON
- `downloadWithProgress(url, onProgress, config?)`: Download file with progress
- `postWithUploadProgress(url, body, onUploadProgress, config?)`: POST with upload progress (XHR)

## 🧩 License

MIT
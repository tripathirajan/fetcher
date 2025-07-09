# 📍 Fetcher Project Roadmap

A structured roadmap to guide the ongoing development and improvement of `@tripathirajan/fetcher`.

---

## ✅ Released Features (v1.0.0)

- Universal fetch with fallback support
- Works in browser and Node.js
- Supports:
  - Timeout
  - Retry
  - Interceptors
  - withCredentials
  - Raw response return
  - TypeScript types
- Bundled for CJS, ESM, UMD (global)
- Full documentation & examples
- GitHub Pages with typedocs

---

## 🛠️ PATCH WORK (v1.0.x)

- [ ] Create `FetcherError` class for better error context
- [ ] Add `@throws` JSDoc tags for error-producing methods
- [ ] Improve typing around `.json()` parsing in TS
- [ ] Improve error messages with `FetcherError`
- [ ] Better `withTimeout()` fallback handling
- [ ] Refine fallback behavior on Node (e.g., progress stubs)
- [ ] Test cases for edge scenarios in interceptors
- [ ] Improve default headers merging logic
- [ ] Bundle optimization: ensure tree-shaking safe

---

## ✨ MINOR FEATURES (v1.x.0)

Non-breaking features and enhancements.

### 🧰 Node.js Compatibility

- [ ] Graceful fallback for XHR-only features (upload/download progress)
- [ ] Streamed file downloads in Node using `http`/`https`
- [ ] Polyfill detection warnings/logs

### 📦 Fetcher Extensions

- [ ] `fetcher.form()` for automatic content-type detection and encoding
- [ ] `fetcher.on(event, handler)` for telemetry and lifecycle hooks
- [ ] Retry backoff strategy (e.g., exponential, custom delay function)
- [ ] `fetcher.upload()` abstraction
- [ ] `fetcher.beacon()` support (for fire-and-forget use cases)
- [ ] `fetcher.form()` to auto-handle `FormData`
- [ ] Opt-in debug mode for console tracing

---

## 🚀 MAJOR FEATURES (v2.x.0+)

- [ ] Middleware-style plugin system (`fetcher.use(plugin)`)
- [ ] Better interceptor management (e.g., `eject`, chaining)
- [ ] Abortable requests and global signal handling
- [ ] Streamable large-response support (e.g., `response.body`)
- [ ] Plugin-based architecture (e.g., `fetcher.use(loggingPlugin)`)
- [ ] Configurable transports (e.g., Axios, Ky)
- [ ] Built-in cookie jar/session manager for Node.js
- [ ] Stream support for fetcher responses (ReadableStreams)
- [ ] Middleware chaining system

---

## 📘 Documentation & Community

- [ ] Add coverage badge & thresholds
- [ ] Setup GitHub Discussions
- [ ] Create release post (dev.to / medium)
- [ ] Add examples for frameworks (React, Vue, etc.)
- [ ] Add interactive CodeSandbox playground
- [ ] Add i18n examples (e.g., localized docs/examples)

---

_Last updated: July 2025_

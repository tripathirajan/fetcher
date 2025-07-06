import fetcher from './index';

declare global {
  interface Window {
    fetcher: typeof fetcher;
  }
}

window.fetcher = fetcher;

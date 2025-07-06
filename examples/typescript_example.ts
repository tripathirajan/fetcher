// @ts-expect-error: fetcher types may not be available in this example context
import fetcher, { FetcherInstance, RequestConfig } from '@tripathirajan/fetcher';

interface User {
  id: number;
  name: string;
  email: string;
}

async function main(): Promise<void> {
  const config: RequestConfig = {
    baseURL: 'https://api.example.com',
    timeout: 5000,
  };

  const api: FetcherInstance = fetcher.create(config);

  const res = await api.get('/users');
  const data: User[] = await res.json();
  console.log('TypeScript response:', data);
}

main();
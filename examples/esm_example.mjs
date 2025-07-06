import fetcher from '@tripathirajan/fetcher';

const api = fetcher.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

const res = await api.get('/endpoint');
const data = await res.json();
console.log('ESM response:', data);

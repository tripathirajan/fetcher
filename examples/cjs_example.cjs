const fetcher = require('@tripathirajan/fetcher').default;

async function main() {
  const api = fetcher.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
  });

  const res = await api.get('/endpoint');
  const data = await res.json();
  console.log('CJS response:', data);
}

main();

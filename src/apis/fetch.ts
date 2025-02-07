import { API_CONFIG } from './config';

const fetchData = async <T>(url: string): Promise<T> => {
  console.log('===', url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Api Error: ${response.statusText}`);
  }
  return response.json();
};

await fetchData(API_CONFIG.BASE_URL);

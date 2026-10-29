import { apiGet } from './api';
import { apiPost } from './api';

await apiPost('/users', { name: 'Ana' }, { headers: { 'X-Custom': 'aula07' } });
console.log(await apiGet('/users'));
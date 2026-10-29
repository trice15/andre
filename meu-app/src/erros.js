import { ApiError } from './api';

export function mensagemDeErro(err) {
  if (err instanceof ApiError) {
    if (err.status === 404) return 'Recurso não encontrado';
    if (err.status === 500) return 'Erro no servidor';
    return `Erro ${err.status}: ${err.message}`;
  }
  if (err instanceof TypeError) return 'Falha de rede';
  return 'Erro inesperado';
}
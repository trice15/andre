import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import ListaUsuarios from './ListaUsuarios';
import FormUsuario from './FormUsuario';
import { mensagemDeErro } from './erros';
export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(null); // null | 'novo' | usuario em edição

useEffect(() => {
  const controller = new AbortController();

  apiGet('/users', { signal: controller.signal })
    .then(setUsuarios)
    .catch((e) => {
      if (e.name === 'AbortError') return; // cancelamento não é erro
      setErro(mensagemDeErro(e));
    })
    .finally(() => {
      if (!controller.signal.aborted) setCarregando(false);
    });

  return () => controller.abort();
}, []);

  async function salvar(dados) {
    setErro(null);
    try {
      if (form === 'novo') {
        const criado = await apiPost('/users', dados);
        setUsuarios((prev) => [...prev, criado]);
      } else {
        const atualizado = await apiPut(`/users/${form.id}`, { ...form, ...dados });
        setUsuarios((prev) => prev.map((u) => (u.id === atualizado.id ? atualizado : u)));
      }
      setForm(null);
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir(id) {
    setErro(null);
    const anterior = usuarios;
    setUsuarios((prev) => prev.filter((u) => u.id !== id)); // otimista
    try {
      await apiDelete(`/users/${id}`);
      console.log(`Usuário ${id} excluído`);
    } catch (e) {
      setUsuarios(anterior); // rollback
      setErro(e.message);
    }
  }

  return (
    <main>
      <h1>Usuários</h1>
      <button onClick={() => setForm('novo')}>Novo</button>

      {erro && <p>Erro: {erro}</p>}
      {form && (
        <FormUsuario
          key={form === 'novo' ? 'novo' : form.id}
          inicial={form === 'novo' ? null : form}
          onSalvar={salvar}
          onCancelar={() => setForm(null)}
        />
      )}

      {carregando ? (
        <p>Carregando...</p>
      ) : usuarios.length === 0 ? (
        <p>Nenhum usuário.</p>
      ) : (
        <ListaUsuarios usuarios={usuarios} onEditar={setForm} onExcluir={excluir} />
      )}
    </main>
  );
}
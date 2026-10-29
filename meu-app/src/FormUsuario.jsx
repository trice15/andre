import { useState } from 'react';

export default function FormUsuario({ inicial, onSalvar, onCancelar }) {
  const [campos, setCampos] = useState({
    name: inicial?.name ?? '',
    email: inicial?.email ?? '',
  });
  const [enviando, setEnviando] = useState(false);

  const alterar = (e) => setCampos({ ...campos, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    await onSalvar(campos);
    setEnviando(false);
  }

  return (
    <form onSubmit={enviar}>
      <input name="name" value={campos.name} onChange={alterar} placeholder="Nome" required />
      <input name="email" type="email" value={campos.email} onChange={alterar} placeholder="Email" required />
      <button disabled={enviando}>{enviando ? 'Salvando...' : 'Salvar'}</button>
      <button type="button" onClick={onCancelar}>Cancelar</button>
    </form>
  );
}
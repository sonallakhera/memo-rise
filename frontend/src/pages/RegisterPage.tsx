import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const data = await api.register(form);
      setToken(data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="mx-auto mt-12 max-w-md px-4">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Register</h1>
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-brand-mid/20 bg-white p-5">
        <input placeholder="Name" className="rounded-md border px-3 py-2" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        <input required placeholder="Username" className="rounded-md border px-3 py-2" value={form.username} onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))} />
        <input required type="email" placeholder="Email" className="rounded-md border px-3 py-2" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
        <input required type="password" placeholder="Password" className="rounded-md border px-3 py-2" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-md bg-brand-dark px-4 py-2 text-white">Register</button>
      </form>
    </main>
  );
}

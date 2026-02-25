import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const data = await api.login({ email, password });
      setToken(data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="mx-auto mt-12 max-w-md px-4">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Login</h1>
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-brand-mid/20 bg-white p-5">
        <input type="email" required placeholder="Email" className="rounded-md border px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input type="password" required placeholder="Password" className="rounded-md border px-3 py-2" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-md bg-brand-dark px-4 py-2 text-white">Login</button>
      </form>
    </main>
  );
}

import { useState } from 'react';

export function SetForm({ onSubmit }: { onSubmit: (value: { name: string; difficulty: 'easy' | 'good' | 'hard' }) => void }) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'good' | 'hard'>('good');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ name, difficulty });
        setName('');
      }}
      className="grid gap-3 rounded-xl border border-brand-mid/20 bg-white p-4"
    >
      <input
        required
        maxLength={50}
        placeholder="Set name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="rounded-md border border-brand-mid/30 px-3 py-2"
      />
      <select
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value as 'easy' | 'good' | 'hard')}
        className="rounded-md border border-brand-mid/30 px-3 py-2"
      >
        <option value="easy">Easy</option>
        <option value="good">Good</option>
        <option value="hard">Hard</option>
      </select>
      <button className="rounded-md bg-brand-dark px-3 py-2 text-white">Create Set</button>
    </form>
  );
}

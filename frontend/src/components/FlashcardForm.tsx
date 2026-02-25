import { useState } from 'react';

export function FlashcardForm({ onSubmit }: { onSubmit: (value: { title: string; definition: string }) => void }) {
  const [title, setTitle] = useState('');
  const [definition, setDefinition] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ title, definition });
        setTitle('');
        setDefinition('');
      }}
      className="grid gap-3 rounded-xl border border-brand-mid/20 bg-white p-4"
    >
      <input
        required
        placeholder="Card title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="rounded-md border border-brand-mid/30 px-3 py-2"
      />
      <textarea
        required
        placeholder="Definition"
        value={definition}
        onChange={(event) => setDefinition(event.target.value)}
        className="rounded-md border border-brand-mid/30 px-3 py-2"
      />
      <button className="rounded-md bg-brand-mid px-3 py-2 text-white">Add Card</button>
    </form>
  );
}

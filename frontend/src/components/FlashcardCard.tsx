import { useState } from 'react';

type Props = {
  card: { _id: string; title: string; definition: string };
  onLearned: () => void;
  onUnlearned: () => void;
};

export function FlashcardCard({ card, onLearned, onUnlearned }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article className="card-shadow w-full rounded-2xl border border-brand-mid/20 bg-white p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-brand-mid">Tap to flip</p>
      <button className="w-full text-left" onClick={() => setFlipped((prev) => !prev)}>
        <h2 className="min-h-24 text-2xl font-semibold text-brand-dark">{flipped ? card.definition : card.title}</h2>
      </button>
      <div className="mt-8 flex items-center justify-between gap-2">
        <button
          onClick={onLearned}
          className="flex-1 rounded-xl border border-brand-mid/20 bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          Swipe Left: Learned
        </button>
        <button
          onClick={onUnlearned}
          className="flex-1 rounded-xl border border-brand-mid/20 bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900"
        >
          Swipe Right: Unlearned
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-brand-mid">← Learned • Unlearned →</p>
    </article>
  );
}

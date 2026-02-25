export function FlashcardList({ cards }: { cards: Array<{ _id: string; title: string; learned: boolean }> }) {
  return (
    <ul className="grid gap-2">
      {cards.map((card) => (
        <li key={card._id} className="rounded-lg border border-brand-mid/20 bg-white px-3 py-2 text-sm">
          <span className="font-medium">{card.title}</span>
          <span className="ml-2 text-xs text-brand-mid">{card.learned ? 'Learned' : 'Pending'}</span>
        </li>
      ))}
    </ul>
  );
}

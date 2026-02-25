import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { FlashcardCard } from '../components/FlashcardCard';

type TestCard = {
  _id: string;
  title: string;
  definition: string;
  setId?: string;
};

export function TestPage() {
  const [params] = useSearchParams();
  const [cards, setCards] = useState<TestCard[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const mode = useMemo(() => params.get('mode') ?? 'automatic', [params]);
  const setId = params.get('setId') ?? '';
  const difficulty = (params.get('difficulty') ?? 'good') as 'easy' | 'good' | 'hard';

  useEffect(() => {
    const loadCards = async () => {
      if (mode === 'set' && setId) {
        setCards(await api.testBySet(setId));
      } else if (mode === 'difficulty') {
        setCards(await api.testByDifficulty(difficulty));
      } else {
        setCards(await api.testAutomatic());
      }
      setIndex(0);
      setDone(false);
    };

    void loadCards();
  }, [mode, setId, difficulty]);

  const current = cards[index];

  const handleAnswer = async (learned: boolean) => {
    if (!current) {
      return;
    }

    if (current.setId) {
      await api.markLearned(current.setId, current._id, learned);
    }

    if (index + 1 >= cards.length) {
      await api.completeTest();
      setDone(true);
      return;
    }

    setIndex((value) => value + 1);
  };

  return (
    <main className="mx-auto grid max-w-2xl gap-4 px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark">Test Session</h1>
      {done ? (
        <section className="rounded-xl border border-brand-mid/20 bg-white p-6">
          <p className="text-lg font-medium">Session complete. Streak updated.</p>
        </section>
      ) : current ? (
        <FlashcardCard card={current} onLearned={() => void handleAnswer(true)} onUnlearned={() => void handleAnswer(false)} />
      ) : (
        <section className="rounded-xl border border-brand-mid/20 bg-white p-6">
          <p>No cards available for this test mode yet.</p>
        </section>
      )}
    </main>
  );
}

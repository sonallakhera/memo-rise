import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { FlashcardForm } from '../components/FlashcardForm';
import { FlashcardList } from '../components/FlashcardList';
import { ProgressAnalytics } from '../components/ProgressAnalytics';
import { SetForm } from '../components/SetForm';

type SetType = {
  _id: string;
  name: string;
  difficulty: 'easy' | 'good' | 'hard';
  cards: Array<{ _id: string; title: string; learned: boolean }>;
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<SetType[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  const selectedSet = sets.find((set) => set._id === selectedSetId);

  const load = async () => {
    const [loadedSets, streakData, scoreData] = await Promise.all([
      api.listSets(),
      api.getStreak(),
      api.getScore(),
    ]);

    setSets(loadedSets as SetType[]);
    if ((loadedSets as SetType[]).length > 0) {
      setSelectedSetId((loadedSets as SetType[])[0]._id);
    }
    setStreak(streakData.dailyStreak);
    setScore(scoreData.memorizeScore);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
      <ProgressAnalytics streak={streak} score={score} />
      <section className="grid gap-4 rounded-2xl border border-brand-mid/20 bg-white p-5 md:grid-cols-2">
        <SetForm
          onSubmit={async (value) => {
            await api.createSet(value);
            await load();
          }}
        />
        {selectedSet && (
          <FlashcardForm
            onSubmit={async (value) => {
              await api.addCard(selectedSet._id, value);
              await load();
            }}
          />
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <aside className="rounded-xl border border-brand-mid/20 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Your Sets</h2>
          <ul className="grid gap-2">
            {sets.map((set) => (
              <li key={set._id}>
                <button
                  onClick={() => setSelectedSetId(set._id)}
                  className={`w-full rounded-md border px-3 py-2 text-left ${selectedSetId === set._id ? 'border-brand-dark bg-brand-bg' : 'border-brand-mid/20'}`}
                >
                  {set.name} ({set.difficulty})
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-xl border border-brand-mid/20 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Cards</h2>
          {selectedSet ? <FlashcardList cards={selectedSet.cards} /> : <p>Create a set to begin.</p>}
          {selectedSet && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/test?mode=set&setId=${selectedSet._id}`)}
                className="rounded-md bg-brand-dark px-3 py-2 text-sm text-white"
              >
                Test This Set
              </button>
              <button
                onClick={async () => {
                  await api.deleteSet(selectedSet._id);
                  await load();
                }}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                Delete Set
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

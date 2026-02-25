import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto grid max-w-4xl gap-8 px-4 py-10">
      <section className="rounded-2xl border border-brand-mid/20 bg-white p-8 card-shadow">
        <p className="text-xs uppercase tracking-widest text-brand-mid">Memo-rise by Dhee Labs</p>
        <h1 className="mt-3 text-4xl font-black text-brand-dark">Retain what you learn, daily.</h1>
        <p className="mt-4 max-w-2xl text-brand-mid">Start a test now, then classify cards as learned or unlearned to drive your spaced repetition streak.</p>
        <button onClick={() => navigate('/test?mode=automatic')} className="mt-6 rounded-lg bg-brand-dark px-5 py-3 font-medium text-white">
          Start Automatic Test
        </button>
      </section>

      <section className="rounded-2xl border border-brand-mid/20 bg-white p-6">
        <h2 className="text-xl font-semibold">Test By</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button onClick={() => navigate('/dashboard')} className="rounded-md border border-brand-mid/20 px-4 py-3 text-left hover:bg-brand-bg">
            By Set
          </button>
          <button onClick={() => navigate('/test?mode=difficulty&difficulty=good')} className="rounded-md border border-brand-mid/20 px-4 py-3 text-left hover:bg-brand-bg">
            By Difficulty
          </button>
        </div>
      </section>
    </main>
  );
}

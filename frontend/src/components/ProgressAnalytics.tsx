export function ProgressAnalytics({ streak, score }: { streak: number; score: number }) {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-brand-mid/20 bg-white p-4">
        <h3 className="text-sm uppercase tracking-widest text-brand-mid">Daily Streak</h3>
        <p className="text-3xl font-semibold text-brand-dark">{streak} days</p>
      </div>
      <div className="rounded-xl border border-brand-mid/20 bg-white p-4">
        <h3 className="text-sm uppercase tracking-widest text-brand-mid">Memo-rise Score</h3>
        <p className="text-3xl font-semibold text-brand-dark">{score}%</p>
      </div>
    </section>
  );
}

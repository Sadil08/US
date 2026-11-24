import { prisma } from "@/lib/prisma";
import AddDiaryEntryForm from "@/components/AddDiaryEntryForm";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getEntries() {
  try {
    return await prisma.diaryEntry.findMany({ orderBy: { entryDate: "desc" } });
  } catch {
    return null;
  }
}

export default async function DiaryPage() {
  const entries = await getEntries();

  return (
    <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
      <div className="text-center mb-14">
        <p className="font-script text-2xl text-[var(--gold)]">our diary</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-1 mb-6">
          The story, in our own words
        </h1>
        <AddDiaryEntryForm />
      </div>

      {entries === null && (
        <p className="text-center text-[var(--ink-muted)]">
          The database isn&apos;t connected yet &mdash; entries you write will appear here once DATABASE_URL is set.
        </p>
      )}

      {entries !== null && entries.length === 0 && (
        <p className="text-center text-[var(--ink-muted)]">
          Nothing written yet. Be the first to add a page.
        </p>
      )}

      <div className="flex flex-col gap-8">
        {entries?.map((entry) => (
          <article key={entry.id} className="card p-6">
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h2 className="font-display text-2xl">{entry.title}</h2>
              <span className="text-xs uppercase tracking-wide text-[var(--gold)] whitespace-nowrap">
                {entry.author === "ME" ? "him" : "her"}
              </span>
            </div>
            <p className="text-sm text-[var(--ink-muted)] mb-3">
              {format(entry.entryDate, "MMMM d, yyyy")}
            </p>
            <p className="whitespace-pre-wrap leading-relaxed">{entry.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import AddEventForm from "@/components/AddEventForm";
import CountdownBadge from "@/components/CountdownBadge";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    return await prisma.event.findMany({ orderBy: { date: "asc" } });
  } catch {
    return null;
  }
}

export default async function FuturePage() {
  const events = await getEvents();
  const upcoming = events?.filter((e) => e.isFuture) ?? [];
  const past = events?.filter((e) => !e.isFuture) ?? [];

  return (
    <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
      <div className="text-center mb-14">
        <p className="font-script text-2xl text-[var(--gold)]">what&apos;s ahead</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-1 mb-6">
          Our future, so far
        </h1>
        <AddEventForm />
      </div>

      {events === null && (
        <p className="text-center text-[var(--ink-muted)]">
          The database isn&apos;t connected yet &mdash; events you add will appear here once DATABASE_URL is set.
        </p>
      )}

      {events !== null && upcoming.length === 0 && past.length === 0 && (
        <p className="text-center text-[var(--ink-muted)]">
          No events yet. Add the next thing we&apos;re looking forward to.
        </p>
      )}

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl mb-4 text-[var(--rose)]">Coming up</h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((event) => (
              <div key={event.id} className="card p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg">{event.title}</p>
                  <p className="text-sm text-[var(--ink-muted)]">
                    {format(event.date, "MMMM d, yyyy")}
                  </p>
                  {event.note && <p className="text-sm mt-1">{event.note}</p>}
                </div>
                <CountdownBadge date={event.date.toISOString()} />
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-4 text-[var(--rose)]">Already lived</h2>
          <div className="flex flex-col gap-3">
            {past.map((event) => (
              <div key={event.id} className="card p-4">
                <p className="font-display text-lg">{event.title}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  {format(event.date, "MMMM d, yyyy")}
                </p>
                {event.note && <p className="text-sm mt-1">{event.note}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

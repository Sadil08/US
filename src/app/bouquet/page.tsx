import Bouquet from "@/components/Bouquet";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/site-config";

const GENERIC_MESSAGES = [
  "Just because. No reason needed to grow you flowers that never wilt.",
  "Every day with you deserves its own bouquet.",
  "These ones will never need water — they're yours forever.",
];

async function getOccasionMessage() {
  try {
    const DAY = 1000 * 60 * 60 * 24;
    const now = new Date();
    const events = await prisma.event.findMany({ where: { isFuture: true } });

    for (const event of events) {
      const diff = Math.abs(event.date.getTime() - now.getTime());
      if (diff <= 3 * DAY) {
        return `For ${event.title.toLowerCase()} — I made these for you, ${SITE_CONFIG.herName}.`;
      }
    }
  } catch {
    // DB not configured yet - fall back to a generic message.
  }

  const index = new Date().getDate() % GENERIC_MESSAGES.length;
  return GENERIC_MESSAGES[index];
}

export default async function BouquetPage() {
  const message = await getOccasionMessage();

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div>
        <p className="font-script text-2xl text-[var(--gold)]">a little something</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-1">
          Flowers that never fade
        </h1>
      </div>

      <Bouquet />

      <p className="max-w-md text-[var(--ink-muted)]">{message}</p>
    </main>
  );
}

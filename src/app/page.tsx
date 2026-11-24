import Link from "next/link";
import FloatingPetals from "@/components/FloatingPetals";
import TimeTogether from "@/components/TimeTogether";
import { SITE_CONFIG } from "@/lib/site-config";
import HeroReveal from "@/components/HeroReveal";

export default function Home() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <FloatingPetals />
      <HeroReveal>
        <p className="font-script text-3xl text-[var(--gold)] mb-2">for</p>
        <h1 className="font-display text-5xl sm:text-7xl mb-4">
          {SITE_CONFIG.herName}
        </h1>
        <TimeTogether />
        <p className="max-w-md mx-auto mt-6 text-[var(--ink-muted)]">
          Every scroll on this little site is something we lived through
          together &mdash; and some things still waiting for us.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/bouquet" className="btn btn-gold">
            Open your flowers
          </Link>
          <Link href="/memory-lane" className="btn">
            Walk our memory lane
          </Link>
          <Link href="/diary" className="btn">
            Read our diary
          </Link>
        </div>
      </HeroReveal>
    </main>
  );
}

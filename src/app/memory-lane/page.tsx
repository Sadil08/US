import { prisma } from "@/lib/prisma";
import PhotoCard from "@/components/PhotoCard";
import UploadPhotoForm from "@/components/UploadPhotoForm";

export const dynamic = "force-dynamic";

async function getPhotos() {
  try {
    return await prisma.photo.findMany({ orderBy: { takenAt: "asc" } });
  } catch {
    return null; // DB not configured yet
  }
}

export default async function MemoryLanePage() {
  const photos = await getPhotos();

  const groups: { milestone: string; photos: NonNullable<typeof photos> }[] = [];
  if (photos) {
    for (const photo of photos) {
      const label = photo.milestone || "Along the way";
      const last = groups[groups.length - 1];
      if (last && last.milestone === label) {
        last.photos.push(photo);
      } else {
        groups.push({ milestone: label, photos: [photo] });
      }
    }
  }

  return (
    <main className="flex-1 px-6 py-16 max-w-4xl mx-auto w-full">
      <div className="text-center mb-14">
        <p className="font-script text-2xl text-[var(--gold)]">memory lane</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-1 mb-6">
          Everything we&apos;ve lived
        </h1>
        <UploadPhotoForm />
      </div>

      {photos === null && (
        <p className="text-center text-[var(--ink-muted)]">
          The photo database isn&apos;t connected yet &mdash; set DATABASE_URL and the R2 env vars, then photos you add will show up here.
        </p>
      )}

      {photos !== null && photos.length === 0 && (
        <p className="text-center text-[var(--ink-muted)]">
          No memories yet. Add the first one above.
        </p>
      )}

      <div className="flex flex-col gap-16">
        {groups.map((group, gi) => (
          <section key={gi}>
            <h2 className="font-display text-2xl mb-6 text-[var(--rose)]">
              {group.milestone}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {group.photos.map((photo, pi) => (
                <PhotoCard
                  key={photo.id}
                  id={photo.id}
                  photoKey={photo.key}
                  width={photo.width}
                  height={photo.height}
                  blurDataUrl={photo.blurDataUrl}
                  caption={photo.caption}
                  milestone={photo.milestone}
                  takenAt={photo.takenAt.toISOString()}
                  index={pi}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export function thumbKeyFor(key: string) {
  return key.replace(/^photos\//, "thumbs/");
}

export function imageUrl(key: string) {
  return `/api/image/${key}`;
}

export function thumbUrl(key: string) {
  return imageUrl(thumbKeyFor(key));
}

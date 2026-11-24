import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

function getClient() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const BUCKET = () => {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME env var is not set");
  return bucket;
};

// Max edge length we keep. Plenty for full-screen viewing and pinch-zoom
// on any phone or monitor, while keeping files small.
const MAX_DIMENSION = 2400;
const QUALITY = 82;

export type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  blurDataUrl: string;
};

export async function processImage(input: Buffer): Promise<ProcessedImage> {
  const rotated = sharp(input).rotate(); // auto-orient from EXIF, then strip it

  const resized = rotated.resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  const webp = await resized.clone().webp({ quality: QUALITY }).toBuffer();
  const { width = 0, height = 0 } = await sharp(webp).metadata();

  const blurBuffer = await resized
    .clone()
    .resize({ width: 24 })
    .webp({ quality: 40 })
    .toBuffer();
  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return { buffer: webp, width, height, blurDataUrl };
}

export async function uploadToR2(key: string, buffer: Buffer, contentType: string) {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function getFromR2(key: string) {
  const client = getClient();
  const result = await client.send(
    new GetObjectCommand({ Bucket: BUCKET(), Key: key })
  );
  return result;
}

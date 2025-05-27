import type { NextApiRequest, NextApiResponse } from "next";
import { getFromCache, saveToCache } from "@/lib/redis/cache";

const GOOGLE_PLACE_PHOTO_BASE = "https://maps.googleapis.com/maps/api/place/photo";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ref, area, placeId } = req.query;

  if (!ref || typeof ref !== "string" || !area || typeof area !== "string") {
    return res.status(400).json({ error: "Missing ref or area param" });
  }

  const subPath = "carikopi";
  const cacheKey = `${area}:photo:place_${placeId}`;
  const cachedImage = await getFromCache<string>(subPath, cacheKey);

  if (cachedImage) {
    res.setHeader("Content-Type", "image/jpeg");
    return res.send(Buffer.from(cachedImage, "base64"));
  }

  try {
    const photoRes = await fetch(`${GOOGLE_PLACE_PHOTO_BASE}?maxwidth=400&photoreference=${ref}&key=${GOOGLE_API_KEY}`);
    const buffer = await photoRes.arrayBuffer();

    const base64 = Buffer.from(buffer).toString("base64");
    await saveToCache(subPath, cacheKey, base64, 60 * 60 * 24 * 30); // 30 days

    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(base64, "base64"));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch image", detail: err });
  }
}
import type { NextApiRequest, NextApiResponse } from "next";

import { getFromCache, saveToCache } from "@/lib/redis/cache";
import type { ShopDetail } from "@/types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { placeId } = req.query;

  if (!placeId || typeof placeId !== "string") {
    return res.status(400).json({ error: "Missing or invalid placeId" });
  }

  const subPath = "carikopi";
  const cacheKey = `detail:place_${placeId}`;

  // Check cache first
  const cached = await getFromCache<ShopDetail>(subPath, cacheKey);
  if (cached) {
    console.log("Get detail from cache redis...");
    return res.status(200).json({ fromCache: true, data: cached });
  }

  try {
    console.log("Calling detail api...");

    const fields = [
      "place_id",
      "name",
      "formatted_address",
      "formatted_phone_number",
      "international_phone_number",
      "website",
      "url",
      "rating",
      "user_ratings_total",
      "business_status",
      "price_level",
      "types",
      "vicinity",
      "address_components",
      "geometry",
      "opening_hours",
      "reviews",
      "photos",
    ].join(",");

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      return res
        .status(500)
        .json({ error: data.error_message || "Failed to fetch place details" });
    }

    // Build images[] by convert images to base64
    const photos = data.result.photos?.slice(0, 3) || [];
    const imageUrls = await Promise.all(
      photos.map(async (photo: { photo_reference: string | null }) => {
        const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;

        const imageRes = await fetch(googlePhotoUrl);

        if (!imageRes.ok) {
          throw new Error(`Failed to fetch image: ${photo.photo_reference}`);
        }

        const buffer = await imageRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        return `data:image/jpeg;base64,${base64}`;
      })
    );

    data.result.photos = imageUrls;

    // Cache for 1 month
    const ttlSeconds = 60 * 60 * 24 * 30;
    await saveToCache(subPath, cacheKey, data.result, ttlSeconds);

    return res.status(200).json({ fromCache: false, data: data.result });
  } catch (error) {
    console.error("API Details Error:", error);
    return res
      .status(500)
      .json({
        error: "Internal server error",
        detail: (error as Error).message,
      });
  }
}

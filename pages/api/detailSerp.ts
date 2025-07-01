import type { NextApiRequest, NextApiResponse } from "next";

import { getFromCache, saveToCache } from "@/lib/redis/cache";
import type { SerpShopDetail } from "@/types";

const SERP_API_KEY = process.env.SERP_API_KEY!;

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
  const cached = await getFromCache<SerpShopDetail>(subPath, cacheKey);
  if (cached) {
    console.log("Get detail from cache redis...");
    return res.status(200).json({ fromCache: true, data: cached });
  }

  try {
    console.log("Calling detail api...");

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_maps&place_id=${placeId}&api_key=${SERP_API_KEY}`
    );
    const data = await response.json();

    if (!data.place_results) {
      return res.status(500).json({ error: "No details found" });
    }

    // Cache for 1 month
    const ttlSeconds = 60 * 60 * 24 * 30;
    await saveToCache(subPath, cacheKey, data.place_results, ttlSeconds);

    return res.status(200).json({ fromCache: false, data: data.place_results });
  } catch (error) {
    console.error("Failed to fetch SerpApi details: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

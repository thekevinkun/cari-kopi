import type { NextApiRequest, NextApiResponse } from "next";
import { getFromCache, saveToCache } from "@/lib/redis/cache";

import { slugify } from "@/utils/helpers";
import { PlaceResponse } from "@/types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lng, shortAddress } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude." });
    }


    const area = shortAddress ? slugify(String(shortAddress)) : `${lat},${lng}`;
    const subPath = "carikopi";
    const cacheKey = area;

    // Check cache first
    const cached = await getFromCache<{ results: PlaceResponse[] }>(subPath, cacheKey);
    if (cached) {
        console.log("Get from cache redis...");
        return res.status(200).json({ fromCache: true, results: cached.results });
    }

    try {
        console.log("Calling api...");

        // Call Google Places Nearby Search
        const radius = 2000; // in meters
        const keyword = "kopi";
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${keyword}&key=${GOOGLE_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "No cafes found" });
        }
        
        const results = (data.results || []).map((place: PlaceResponse) => {
            const photoRef = place.photos?.[0]?.photo_reference;
            const imageUrl = photoRef ? `/api/image?ref=${photoRef}&area=${area}&placeId=${place.place_id}` : null;

            return {
                placeId: place.place_id,
                name: place.name,
                rating: place.rating,
                thumbnail: imageUrl,
                geometry: {
                    location: {
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng,
                    },
                },
            }
        });
        
        // Cache for 1 month
        const ttlSeconds = 60 * 60 * 24 * 30;
        await saveToCache(subPath, cacheKey, { results }, ttlSeconds);

        return res.status(200).json({ fromCache: false, results });
    } catch (error) {
        console.error("API fetch + Redis error:", error);
        return res.status(500).json({ error: "Failed to fetch and cache coffee shops." });
    }
}
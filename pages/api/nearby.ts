import type { NextApiRequest, NextApiResponse } from "next";
import { getFromCache, saveToCache } from "@/lib/redis/cache";

import { slugify } from "@/utils/helpers";
import { PlaceResponse } from "@/types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function fetchNearbyPlaces(url: string): Promise<any> {
    const res = await fetch(url);
    return res.json();
}

const transformPlaces = (places: PlaceResponse[]) => {
    return places.map((place: PlaceResponse) => {
        const photoRef = place.photos?.[0]?.photo_reference;
        const imageUrl = photoRef
            ? `/api/image?ref=${photoRef}&type=thumbnail&area=place_${place.place_id}`
            : null;

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
        };
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lng, shortAddress } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude." });
    }

    const subPath = "carikopi";
    const cacheKey = shortAddress ? slugify(String(shortAddress)) : `${lat},${lng}`;

    // Check cache first
    const cached = await getFromCache<{ results: PlaceResponse[] }>(subPath, cacheKey);
    if (cached) {
        console.log("Get nearby from cache redis...");
        return res.status(200).json({ fromCache: true, results: cached.results });
    }

    try {
        console.log("Calling nearby api...");

        // Call Google Places Nearby Search
        const radius = 2000; // in meters
        const keyword = "kopi";
        const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        const firstUrl = `${baseUrl}?location=${lat},${lng}&radius=${radius}&keyword=${keyword}&key=${GOOGLE_API_KEY}`;
        
        // Fetch the first page from google api
        const firstPage = await fetchNearbyPlaces(firstUrl);
        let allResults = firstPage.results || [];

        if (!allResults || allResults.length === 0) {
            return res.status(404).json({ error: firstPage.error_message });
        }

        // If there is a next_page_token, wait then fetch the second page
        if (firstPage.next_page_token) {
            const token = firstPage.next_page_token;

            console.log("Waiting for next_page_token to activate...");
            await new Promise((r) => setTimeout(r, 2000)); // wait 2 seconds

            const secondUrl = `${baseUrl}?pagetoken=${token}&key=${GOOGLE_API_KEY}`;
            const secondPage = await fetchNearbyPlaces(secondUrl);

            if (secondPage.results) {
                allResults = allResults.concat(secondPage.results);
            }
        }

        // Transform all thumbnails
        const transformed = transformPlaces(allResults);

        // Cache for 1 month
        const ttlSeconds = 60 * 60 * 24 * 30;
        await saveToCache(subPath, cacheKey, { results: transformed }, ttlSeconds);

        return res.status(200).json({ fromCache: false, results: transformed });
    } catch (error) {
        console.error("API fetch + Redis error:", error);
        return res.status(500).json({ error: "Failed to fetch and cache coffee shops." });
    }
}
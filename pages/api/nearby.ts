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
    const { lat, lng, shortAddress, page = "1" } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Missing latitude or longitude." });
    }

    const subPath = "carikopi";
    const cacheKey = shortAddress ? slugify(String(shortAddress)) : `${lat},${lng}`;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageKey = `${cacheKey}:page:${pageNumber}`;

    // Try to fetch this page from cache
    const cached = await getFromCache<{ results: PlaceResponse[] }>(subPath, pageKey);
    if (cached) {
        console.log(`Get nearby page ${pageNumber} from Redis cache...`);

        const meta = await getFromCache<{ totalPages: number; totalResults: number; lastUpdated: string; locationKey: string }>(subPath, `${cacheKey}:meta`);

        return res.status(200).json({
            fromCache: true,
            page: pageNumber,
            totalPages: meta?.totalPages ?? 1,
            totalResults: meta?.totalResults ?? 0,
            results: cached.results,
        });
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
        console.log("First fetch: ", firstPage);
        let allResults = firstPage.results || [];

        if (!allResults || allResults.length === 0) {
            return res.status(404).json({ error: firstPage.error_message });
        }

        // If there is a next_page_token for second page, wait then fetch
        if (firstPage.next_page_token) {
            console.log("Waiting for page 2 token to activate...");
            await new Promise((r) => setTimeout(r, 2000)); // wait 2 seconds

            const secondUrl = `${baseUrl}?pagetoken=${firstPage.next_page_token}&key=${GOOGLE_API_KEY}`;
            const secondPage = await fetchNearbyPlaces(secondUrl);
            console.log("Second fetch: ", secondPage);

            if (secondPage.results) {
                allResults = allResults.concat(secondPage.results);
            }

            if (secondPage.next_page_token) {
                console.log("Waiting for page 3 token to activate...");
                await new Promise((r) => setTimeout(r, 3000)); // wait 3 seconds
                
                const thirdUrl = `${baseUrl}?pagetoken=${secondPage.next_page_token}&key=${GOOGLE_API_KEY}`
                const thirdPage = await fetchNearbyPlaces(thirdUrl);
                console.log("Third fetch: ", thirdPage);
                
                if (thirdPage.results) {
                    allResults = allResults.concat(thirdPage.results);
                };
            }
        }

        // Transform all thumbnails
        const transformed = transformPlaces(allResults);

        const pageSize = 20;
        const totalResults = transformed.length;
        const totalPages = Math.ceil(totalResults / pageSize);
        const ttlSeconds = 60 * 60 * 24 * 30; // 1 month

        // // Cache metadata
        const meta = {
            totalPages,
            totalResults,
            lastUpdated: new Date().toISOString(),
            locationKey: cacheKey,
        };

        await saveToCache(subPath, `${cacheKey}:meta`, meta, ttlSeconds);

        // // Cache all pages
        for (let i = 0; i < totalPages; i++) {
            const slice = transformed.slice(i * pageSize, (i + 1) * pageSize);
            await saveToCache(subPath, `${cacheKey}:page:${i + 1}`, { results: slice }, ttlSeconds);
        }

        return res.status(200).json({
            fromCache: false,
            page: 1,
            totalPages,
            totalResults,
            results: transformed.slice(0, pageSize),
        });
    } catch (error) {
        console.error("API fetch + Redis error:", error);
        return res.status(500).json({ error: "Failed to fetch and cache coffee shops." });
    }
}
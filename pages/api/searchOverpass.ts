import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat or lng" });
  }

  // Find anything with the word cafe within radius
  const overpassQuery = `
        [out:json];
        (
        node["amenity"="cafe"](around:2000,${lat},${lng});
        way["amenity"="cafe"](around:2000,${lat},${lng});
        relation["amenity"="cafe"](around:2000,${lat},${lng});
        );
        out center;
    `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
    });

    const data = await response.json();

    const results = data.elements.map((place: any) => ({
      place_id: place.id,
      name: place.tags?.name || "Unnamed Cafe",
      geometry: {
        location: {
          lat: place.lat || place.center?.lat,
          lng: place.lon || place.center?.lon,
        },
      },
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error("Overpass error:", error);
    res.status(500).json({ error: "Failed to fetch coffee shops" });
  }
}

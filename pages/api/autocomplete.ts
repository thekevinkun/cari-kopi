import type { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, sessiontoken } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query required" });
  }

  const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query
  )}&key=${GOOGLE_API_KEY}&sessiontoken=${sessiontoken}&types=establishment&keyword=coffee`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Autcomplete failed: ", error)
    res.status(500).json({ error: "Autocomplete failed" });
  }
}

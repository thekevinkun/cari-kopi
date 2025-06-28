import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imageUrl = req.query.url;

  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).send("Missing image URL");
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0", // prevent blocking
      },
    });

    if (!response.ok || !response.body) {
      return res.status(500).send("Failed to fetch image");
    }

    // Convert ReadableStream to Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Image proxy error:", error);
    res.status(500).send("Internal Server Error");
  }
}

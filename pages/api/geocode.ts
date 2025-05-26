import type { NextApiRequest, NextApiResponse } from "next";

import { formatShortAddress } from "@/utils/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lng, address } = req.query;

  // REVERSE geocoding (lat/lng → address)
  if (lat && lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      
      if (!data)
        return res.status(400).json({ error: "Reverse Geocoding failed", details: data });

      const address = data.address;
      const fullAddress = formatShortAddress(data.address);
      const shortAddress = `${address.suburb || address.neighbourhood || address.village || ""}, ${address.city || address.town || address.county || ""}`.trim();
      
      return res.status(200).json({
        fullAddress,
        shortAddress,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch address", details: error });
    }
  }

  // FORWARD geocoding (address → lat/lng)
  if (address && typeof address === "string") {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.length === 0) 
        return res.status(404).json({ error: "No location found", details: data });
      
      const { lat, lon } = data[0];
      return res.status(200).json({ lat, lng: lon });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch geocode", details: error });
    }
  }

  return res.status(400).json({ error: "Missing required parameters" });
}
import type { NextApiRequest, NextApiResponse } from "next";

import type { AddressComponent, GeocodeResponse } from "@/types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng, address } = req.query;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Missing Google API Key" });
  }

  // REVERSE GEOCODING
  if (lat && lng) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const geoData: GeocodeResponse = await response.json();

      if (!geoData.results || geoData.results.length === 0) {
        return res
          .status(400)
          .json({ error: "Reverse Geocoding failed", details: geoData });
      }

      const components = geoData.results[0].address_components;
      const fullAddress = geoData.results[0].formatted_address;

      const getComponent = (type: string): string =>
        components.find((c: AddressComponent) => c.types.includes(type))
          ?.long_name || "";

      const suburb =
        getComponent("sublocality") ||
        getComponent("neighborhood") ||
        getComponent("administrative_area_level_4");

      const city =
        getComponent("locality") || getComponent("administrative_area_level_2");

      const shortAddress = `${suburb}, ${city}`.trim();

      return res.status(200).json({ fullAddress, shortAddress });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch address", details: error });
    }
  }

  // FORWARD GEOCODING
  if (address && typeof address === "string") {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_API_KEY}`
      );
      const geoData: GeocodeResponse = await response.json();

      if (!geoData.results || geoData.results.length === 0) {
        return res
          .status(404)
          .json({ error: "No location found", details: geoData });
      }

      const { lat, lng } = geoData.results[0].geometry.location;
      return res.status(200).json({ lat, lng });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch geocode", details: error });
    }
  }

  return res.status(400).json({ error: "Missing required parameters" });
}

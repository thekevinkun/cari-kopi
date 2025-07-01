import type { NextApiRequest, NextApiResponse } from "next";

import type { GoogleStep } from "@/types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Missing origin or destination" });
  }

  const modes = ["driving", "walking", "bicycling", "transit"];

  try {
    const responses = await Promise.all(
      modes.map(async (mode) => {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        return {
          mode,
          route: data.routes?.[0] || null,
          duration: data.routes?.[0]?.legs?.[0]?.duration?.text || null,
          distance: data.routes?.[0]?.legs?.[0]?.distance?.text || null,
        };
      })
    );

    const defaultResponse = responses[0];
    const defaultPolyline =
      defaultResponse.route?.overview_polyline?.points || null;

    const steps =
      defaultResponse.route?.legs?.[0]?.steps?.map((step: GoogleStep) => ({
        instruction: step.html_instructions,
        distance: step.distance?.text || null,
        duration: step.duration?.text || null,
        maneuver: step.maneuver || null,
      })) || [];

    return res.status(200).json({
      polyline: defaultPolyline,
      modes: responses.map(({ mode, duration, distance }) => ({
        mode,
        duration,
        distance,
      })),
      steps,
    });
  } catch (error) {
    console.error("Directions fetch error:", error);
    return res.status(500).json({ error: "Failed to get directions" });
  }
}

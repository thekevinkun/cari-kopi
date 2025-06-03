import type { OSMAddress } from "@/types";

export const slugify = (text: string): string => {
  return text
    .normalize("NFD") // Normalize accented characters (e.g., é → e + ́)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
};

export const formatShortAddress = (address: OSMAddress): string => {
  const street = address.road || address.residential || address.pedestrian || "";
  const suburb = address.suburb || address.neighbourhood || address.village || "";
  const city = address.city || address.town || address.county || "";
  const state = address.state || "";
  const country = address.country || "";

  return [street, suburb, city, state, country].filter(Boolean).join(", ");
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertSerpApiHoursToWeekdayText = (hours: { [key: string]: string }[]): string[] => {
  const orderedDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  const dayMap = hours.reduce((acc, obj) => {
    const [day, time] = Object.entries(obj)[0];
    acc[day.toLowerCase()] = `${capitalize(day)}: ${time}`;
    return acc;
  }, {} as Record<string, string>);

  return orderedDays.map(day => dayMap[day] || `${capitalize(day)}: Closed`);
}

export const getStarsSVG = (rating: number, isMobile: boolean): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const iconSize = isMobile ? 10 : 12;

  const fullStar = `
    <svg width=${iconSize} height=${iconSize} viewBox="0 0 24 24" fill="#faaf00" xmlns="http://www.w3.org/2000/svg" style="">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  `;

  const halfStar = `
    <svg width=${iconSize} height=${iconSize} viewBox="0 0 24 24" fill="#faaf00" xmlns="http://www.w3.org/2000/svg" style="">
      <path d="M12 15.4L8.24 17.67 9.24 13.39 5.91 10.51 10.3 10.13 12 6 13.7 10.13 18.09 10.51 14.76 13.39 15.76 17.67 12 15.4Z" />
      <path d="M12 2L14.81 8.63L22 9.24L16.54 13.97L18.18 21L12 17.27V2Z" fill="#ababab"/>
    </svg>
  `;

  const emptyStar = `
    <svg width=${iconSize} height=${iconSize} viewBox="0 0 24 24" fill="#ababab" xmlns="http://www.w3.org/2000/svg" style="">
      <path d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z"/>
    </svg>
  `;

  const full = fullStar.repeat(fullStars);
  const half = hasHalfStar ? halfStar : "";
  const empty = emptyStar.repeat(emptyStars);

  return `<div style="display:flex;align-items:center">${full}${half}${empty}</div>`;
}
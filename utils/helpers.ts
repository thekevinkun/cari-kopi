import type { ExtensionData, ExtensionGroup, OSMAddress } from "@/types";

export const slugify = (text: string): string => {
  return text
    .normalize("NFD") // Normalize accented characters (e.g., é → e + ́)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
};

export const getLocationPermissionInstructions = (): string => {
  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    if (ua.includes("safari") && !ua.includes("crios") && !ua.includes("fxios")) {
      return "Location permission is blocked.\n\nGo to Settings > Privacy & Security > Location Services > Safari Websites";
    }
    if (ua.includes("crios")) {
      return "Location permission is blocked.\n\nGo to Settings > Privacy & Security > Location Services > Chrome";
    }
    if (ua.includes("fxios")) {
      return "Location permission is blocked.\n\nGo to Settings > Privacy & Security > Location Services > Firefox";
    }

    return "Location permission is blocked. Please go to iPhone Settings > Privacy & Security > Location Services > [Browser].";
  }

  if (/android/.test(ua)) {
    if (ua.includes("chrome")) {
      return "Location permission is blocked.\n\nGo to Settings > Apps > Chrome > Permissions > Location";
    }
    return "Location permission is blocked.\n\nPlease go to your browser and device location permissions.";
  }

  if (/macintosh|windows|linux/.test(ua)) {
    if (ua.includes("chrome")) {
      return "Location permission is blocked.\n\nGo to Chrome Settings > Privacy and Security > Site Settings > Location";
    }
    if (ua.includes("firefox")) {
      return "Location permission is blocked.\n\nGo to Firefox Settings > Privacy & Security > Permissions > Location";
    }
    if (ua.includes("safari")) {
      return "Location permission is blocked.\n\nGo to System Settings > Security & Privacy > Location Services";
    }

    return "Location permission is blocked. Please check your browser's location permission settings.";
  }

  return "Location permission is blocked. Please go to your browser or device settings to allow access.";
};

export const formatShortAddress = (address: OSMAddress): string => {
  const street = address.road || address.residential || address.pedestrian || "";
  const suburb = address.suburb || address.neighbourhood || address.village || "";
  const city = address.city || address.town || address.county || "";
  const state = address.state || "";
  const country = address.country || "";

  return [street, suburb, city, state, country].filter(Boolean).join(", ");
}

export const parseSerpAddress = (
  fullAddress: string,
  format: "cityCountry" | "street" = "cityCountry"
): string => {
  const parts = fullAddress.split(",").map((p) => p.trim());

  if (format === "cityCountry") {
    const country = parts[parts.length - 1] || "";

    // Find city by scanning backward and picking the first part WITHOUT a number
    let city = "";
    for (let i = parts.length - 2; i >= 0; i--) {
      const part = parts[i];
      if (!/\d/.test(part)) { // skip parts with numbers like ZIP codes
        city = part;
        break;
      }
    }

    return [city, country].filter(Boolean).join(", ");
  }

  if (format === "street") {
    return parts[0] || fullAddress;
  }

  return fullAddress;
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

export const mergeExtensionsWithUnsupported = (
  extensions: ExtensionData[],
  unsupported: ExtensionData[]
): ExtensionGroup[] => {
  const mappedExtensions: ExtensionGroup[] = extensions.map((entry) => {
    const [key, values] = Object.entries(entry)[0];
    return {
      key,
      values: Array.isArray(values) ? values : [],
    };
  });

  const unsupportedMapped: ExtensionGroup[] = unsupported.map((entry) => {
    const [key, values] = Object.entries(entry)[0];
    return {
      key,
      values: Array.isArray(values) ? values : [],
      _unsupported: true,
    };
  });

  const result: ExtensionGroup[] = [];

  for (const entry of mappedExtensions) {
    result.push(entry);
    if (entry.key === "popular_for") {
      result.push(...unsupportedMapped);
    }
  }

  return result;
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

const emojiMap: { emoji: string; keywords: string[] }[] = [
  { emoji: "☕", keywords: ["coffee"] },
  { emoji: "🍵", keywords: ["tea"] },
  { emoji: "⭐", keywords: ["great", "recommended", "popular"] },

  { emoji: "🌤️", keywords: ["outdoor"] },
  { emoji: "🥡", keywords: ["takeout", "take away"] },
  { emoji: "🍽️", keywords: ["dine", "dining"] },

  { emoji: "🚳", keywords: ["no delivery", "no-contact delivery"] },
  { emoji: "🛵", keywords: ["delivery"] },

  { emoji: "📶", keywords: ["wi-fi", "free wi-fi"] },
  { emoji: "💻", keywords: ["laptop", "work", "remote"] },
  { emoji: "📖", keywords: ["book", "read", "reading"] },

  { emoji: "🧍", keywords: ["solo", "single"] },
  { emoji: "🪑", keywords: ["seating", "seat"] },
  { emoji: "🚻", keywords: ["restroom", "toilet", "bathroom"] },
  { emoji: "♿️", keywords: ["wheelchair"] },

  { emoji: "🌤️", keywords: ["breakfast", "morning"] },
  { emoji: "☀️", keywords: ["lunch", "noon"] },
  { emoji: "🍰", keywords: ["dessert"] },
  { emoji: "🌙", keywords: ["dinner", "night"] },
  { emoji: "⚡", keywords: ["quick"] },
  { emoji: "🍴", keywords: ["bite", "snack"] },

  { emoji: "😌", keywords: ["casual", "relaxed"] },
  { emoji: "🛋️", keywords: ["cozy", "comfortable"] },
  { emoji: "🤫", keywords: ["quiet"] },
  { emoji: "🔥", keywords: ["trendy", "modern", "hip"] },

  { emoji: "🎵", keywords: ["music", "live music"] },
  { emoji: "⚽️", keywords: ["sport", "football"] },
  
  { emoji: "🎓", keywords: ["college", "student"] },
  { emoji: "👥", keywords: ["group", "groups"] },
  { emoji: "🧳", keywords: ["tourist"] },

  { emoji: "📅", keywords: ["appointment", "reservation"] },

  { emoji: "💳", keywords: ["credit", "card"] },
  { emoji: "💵", keywords: ["cash", "money"] },

  { emoji: "🪑👶", keywords: ["children", "high chair", "baby"] },

  { emoji: "🅿️", keywords: ["parking"] },
  { emoji: "🆓", keywords: ["free"] },
  { emoji: "💰", keywords: ["paid"] },
  { emoji: "✔️", keywords: ["plenty", "available"] },
  { emoji: "❌", keywords: ["unavailable", "missing"] },
  { emoji: "🚫", keywords: ["no", "not allowed", "forbidden"] },
];

export const getEmoji = (label: string, isUnsupported = false): string => {
  const lowerLabel = label.toLowerCase();

  for (const { emoji, keywords } of emojiMap) {
    if (keywords.some((word) => lowerLabel.includes(word))) {
      return isUnsupported ? "❌" : emoji;
    }
  }

  return isUnsupported ? "❌" : "✔️";
}

export const formatTitle = (key: string): string => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const getGreeting = (hour: number) => {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 23) return "Good Evening";
  return "You're up late";
}
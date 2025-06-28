import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import type { Coordinates } from "@/types";

const LocationContext = createContext<{
  location: Coordinates | null;
  setLocation: (loc: Coordinates) => void;
}>({
  location: null,
  setLocation: () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocationState] = useState<Coordinates | null>(null);

  // Load from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem("user_location");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.lat && parsed?.lng) {
          setLocationState(parsed);
        }
      } catch (e) {
        console.error("Invalid location in localStorage");
      }
    }
  }, []);

  // Store in localStorage when changed
  const setLocation = (loc: Coordinates) => {
    if (loc) {
      localStorage.setItem("user_location", JSON.stringify(loc));
    } else {
      localStorage.removeItem("user_location");
    }
    setLocationState(loc);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
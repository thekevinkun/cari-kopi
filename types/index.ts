export type Coordinates = {
    lat: number;
    lng: number;
}

export type Shop = {
    placeId: string;
    name: string;
    rating: number;
    thumbnail: string;
    geometry: {
        location: Coordinates
    }
}

export type Map = {
    userLocation: Coordinates | null;
    shops: Shop[];
    onSelectShop: (shop: Shop) => void;
}

export type ActionForm = {
    userLocation: Coordinates | null;
}

export type OSMAddress = {
  road?: string;
  residential?: string;
  pedestrian?: string;
  suburb?: string;
  neighbourhood?: string;
  village?: string;
  city?: string;
  town?: string;
  county?: string;
  state?: string;
  country?: string;
};

export type PlaceResponse = {
  place_id: string;
  name: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }[];
}
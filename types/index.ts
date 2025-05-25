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
}

export type ActionForm = {
    userLocation: Coordinates | null;
}

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
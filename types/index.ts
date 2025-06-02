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

export type ShopMarkerProps = {
  shop: Shop;
  isMobile: boolean;
  delay: number;
};

export type ReviewItemProps = {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description?: string;
  text: string;
  time: number;
}

export type ShopDetail = {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  price_level?: number;
  types?: string[];
  vicinity?: string;
  
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;

  geometry?: {
    location: Coordinates;
    viewport?: {
      northeast: Coordinates;
      southwest: Coordinates;
    };
  };

  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };

  reviews?: ReviewItemProps[];

  photos?: string[];
}

export type Map = {
  userLocation: Coordinates | null;
  shops: Shop[];
  onSelectShop: (shop: Shop) => void;
}

export type ShopDetailProps = {
  shop: ShopDetail;
  showShopDetail: boolean;
  onCloseShopDetail: () => void;
}

export type SkeletonImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

export type ActionFormProps = {
  address: string | null;
  onRequestLocation: () => void;
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
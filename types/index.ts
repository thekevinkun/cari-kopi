export interface User {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationCode?: string | null;
  verificationExpires?: string | null;
  createdAt: string;
}

export type UserLogin = {
  id: string;
  name: string
  email: string;
}

export type UserContextType = {
  user: UserLogin | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}


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

export type GoogleReviewItemProps = {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description?: string;
  text: string;
  time: number;
}

export type SerpPhotosProps = {
  title?: string;
  thumbnail?: string;
  serpapi_thumbnail?: string;
}

export type SerpReviewItemProps = {
  username: string;
  rating: number;
  date: string;
  description: string;
  link: string;
  images?: SerpPhotosProps[];
}

export type ExtensionData = {
  [category: string]: string[];
};

export type ExtensionGroup = {
  key: string;
  values: string[];
  _unsupported?: boolean;
};

export type GoogleShopDetail = {
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

  reviews?: GoogleReviewItemProps[];

  photos?: string[];
}

export interface SerpShopDetail {
  place_id: string;
  title: string;
  rating: number;
  reviews: number;
  price?: string;
  phone?: string;
  address: string;
  open_state?: string;
  gps_coordinates: Coordinates;
  hours?: { [day: string]: string }[];
  type?: string[];
  extensions?: ExtensionData[];
  unsupported_extensions?: ExtensionData[];
  images?: {
    title: string;
    thumbnail: string;
    serpapi_thumbnail: string;
  }[];
  rating_summary?: { stars: number; amount: number }[];
  user_reviews?: {
    summary: [],
    most_relevant: SerpReviewItemProps[]
  };
  popular_times?: {
    graph_results?: {
      [day: string]: {
        time: string;
        info?: string;
        busyness_score: number;
      }[];
    };
    live_hash?: {
      info: string;
      time_spent?: string;
    };
  };
  web_results_link: string;
}

export type Map = {
  userLocation: Coordinates | null;
  shops: Shop[];
  onSelectShop: (shop: Shop) => void;
}

export type ShopDetailProps = {
  shop: SerpShopDetail;
  showShopDetail: boolean;
  onCloseShopDetail: () => void;
}

export type SkeletonImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onClickImage?: () => void;
};

export type ActionFormProps = {
  address: string | null;
  shouldAsk: boolean;
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
import { ObjectId } from "mongodb";
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationCode?: string | null;
  verificationExpires?: Date | null;
  resetToken?: string | null;
  resetTokenExpires?: Date | null;
  createdAt: Date;
}

export type Favorite = {
  _id?: ObjectId;
  userId: ObjectId
  placeId: string;
  createdAt: Date;
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

export type NearbyData = {
  fromCache: boolean;
  page: number;
  totalPages: number,
  totalResults: number,
  results: Shop[],
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
  website?: string;
  open_state?: string;
  gps_coordinates: {
    latitude: number,
    longitude: number
  };
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

export type MapProps = {
  userLocation: Coordinates | null;
  shops: Shop[];
  tempShops: Shop[];
  onSelectShop: (shop: Shop) => void;
  targetShop?: TargetShop | null;
}

export type ShopDetailProps = {
  shop: SerpShopDetail;
  showShopDetail: boolean;
  onCloseShopDetail: () => void;
  onFavoriteUpdate: () => void;
}

export type FavoritesShopProps = {
  favorites: SerpShopDetail[];
  onSelectShop: (shop: SerpShopDetail) => void;
  onFavoriteUpdate: () => void;
  onViewOnMap: (shop: SerpShopDetail) => void;
}

export type TargetShop = {
  lat: number;
  lng: number;
}

export type SkeletonImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onClickImage?: () => void;
};

export type ExplorePanelProps = {
  address: string | null;
  currentResults?: number | null;
  totalResults?: number | null;
  currentPage?: number | null;
  totalPages?: number | null;
  locationStatus: "idle" | "fetching" | "success" | "failed";
  onRequestLocation: () => void;
  isLoadNextPage: boolean;
  onNextPage: () => void;
  onShowLessPage: () => void;
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
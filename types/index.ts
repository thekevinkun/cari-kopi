import { ObjectId } from "mongodb";
import type { LatLngExpression } from "leaflet";
import { SyntheticEvent } from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";

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
  userId: ObjectId;
  placeId: string;
  createdAt: Date;
};

export type UserLogin = {
  id: string;
  name: string;
  email: string;
};

export type UserContextType = {
  user: UserLogin | null;
  setUser: (user: UserLogin | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type NearbyData = {
  fromCache: boolean;
  page: number;
  totalPages: number;
  totalResults: number;
  results: Shop[];
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
};

export type GoogleNearbyResponse = {
  results: PlaceResponse[];
  next_page_token?: string;
  error_message?: string;
  status: string;
}

export type Shop = {
  placeId: string;
  name: string;
  address?: string | "";
  rating: number;
  thumbnail: string;
  geometry: {
    location: Coordinates;
  };
};

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
};

export type SerpPhotosProps = {
  title?: string;
  thumbnail?: string;
  serpapi_thumbnail?: string;
};

export type SerpReviewItemProps = {
  username: string;
  rating: number;
  date: string;
  description: string;
  link: string;
  images?: SerpPhotosProps[];
};

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
};

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
    latitude: number;
    longitude: number;
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
    summary: [];
    most_relevant: SerpReviewItemProps[];
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

export interface AutocompletePrediction {
  description: string;
  matched_substrings: Array<{
    length: number;
    offset: number;
  }>;
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: Array<{
      length: number;
      offset: number;
    }>;
    secondary_text: string;
  };
  terms: Array<{
    offset: number;
    value: string;
  }>;
  types: string[];
}

export type MapProps = {
  userLocation: Coordinates | null;
  backToLocation: boolean;
  shops: Shop[];
  tempShops: Shop[];
  onSelectShop: (shop: Shop) => void;
  targetShop?: TargetShop | null;
  suppressMarkers?: boolean;
  directionLine?: LatLngExpression[] | null;
  destinationShop?: Shop | null;
};

export type MinimapProps = {
  userLocation: Coordinates | null;
  shop: {
    title: string;
    lat: number;
    lng: number;
  };
  directionLine?: LatLngExpression[] | null;
  onClose: () => void;
};

export type ShopDetailProps = {
  shop: SerpShopDetail;
  showShopDetail: boolean;
  onCloseShopDetail: () => void;
  onFavoriteUpdate: () => void;
  onStartDirections: (shop: SerpShopDetail) => void;
};

export type FavoritesShopProps = {
  favorites: SerpShopDetail[];
  onSelectShop: (shop: SerpShopDetail) => void;
  onFavoriteUpdate: () => void;
  onViewOnMap: (shop: SerpShopDetail) => void;
};

export type GoogleStep = {
  html_instructions: string;
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
  maneuver?: string;
};

type TravelInfo = {
  duration: string;
  distance: string;
};

export type Mode = "driving" | "walking" | "bicycling" | "transit";

type TravelStep = {
  instruction: string;
  duration: string | null;
  distance: string | null;
  maneuver: string | null;
};

export type DirectionInfoProps = {
  visible: boolean;
  originAddress: string;
  destinationAddress: string;
  directionInfo: Partial<Record<Mode, TravelInfo>>;
  directionSteps: TravelStep[];
  onCloseDirections: () => void;
};

export type TargetShop = {
  placeId: string;
  lat: number;
  lng: number;
};

export type AlertType = "success" | "error";

export type AlertContextType = {
  showAlert: (message: string, type?: AlertType) => void;
};

export type TopAlertProps = {
  open: boolean;
  message: string;
  type?: AlertType;
  handleClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
};

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
  onBackToLocation: () => void;
  isLoadNextPage: boolean;
  onNextPage: () => void;
  onShowLessPage: () => void;
  onSelectSearchResult: (placeId: string) => void;
};

export type SearchBarProps = {
  onSelectSearchResult: (placeId: string) => void;
};

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
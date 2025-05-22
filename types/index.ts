export type Coordinates = {
    lat: number;
    lng: number;
}

export type Shop = {
    place_id: string;
    name: string;
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
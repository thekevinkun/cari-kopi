import { ObjectId } from "mongodb";
import { getCollection } from "./db";
import type { Favorite } from "@/types";

async function getFavoritesCollection() {
    return await getCollection<Favorite>("favorites");
}

export async function getFavoritesByUser(userId: string) {
    const favorites = await getFavoritesCollection();
    return await favorites.find({ userId: new ObjectId(userId) }).toArray();
}

export async function isFavorite(userId: string, placeId: string) {
  const favorites = await getFavoritesCollection();
  return await favorites.findOne({ userId: new ObjectId(userId), placeId });
}

export async function removeFavorite(userId: string, placeId: string) {
  const favorites = await getFavoritesCollection();
  return await favorites.deleteOne({ userId: new ObjectId(userId), placeId });
}

export async function addFavorite(favorite: Favorite) {
    const favorites = await getFavoritesCollection();
    const result = await favorites.insertOne(favorite);

    return result.insertedId;
}


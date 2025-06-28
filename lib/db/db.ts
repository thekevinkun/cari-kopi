import type { Document, Collection } from "mongodb";
import clientPromise from "./mongodb";

export async function getCollection<T extends Document>(
  collectionName: string
): Promise<Collection<T>> {
  const client = await clientPromise;
  const db = client.db("cari-kopi");
  return db.collection<T>(collectionName);
}

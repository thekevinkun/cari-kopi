"use server";

import { redis } from "./redis";

export async function getFromCache<T>(
  subPath: string,
  cacheKey: string
): Promise<T | null> {
  try {
    const redisKey = `${subPath}:${cacheKey}`;
    const cachedData = await redis.get(redisKey);

    if (!cachedData) {
      console.info(`Cache miss for key: ${redisKey}`);
      return null;
    }

    const parsed =
      typeof cachedData === "string"
        ? (JSON.parse(cachedData) as { data: T; timestamp: number })
        : (cachedData as { data: T; timestamp: number });

    return parsed.data;
  } catch (error) {
    console.error("Redis getFromCache error:", error);
    return null;
  }
}

export async function saveToCache<T>(
  subPath: string,
  cacheKey: string,
  data: T,
  ttlSeconds?: number
): Promise<void> {
  try {
    const redisKey = `${subPath}:${cacheKey}`;
    const wrappedData = { data, timestamp: Date.now() };

    await redis.set(
      redisKey,
      JSON.stringify(wrappedData),
      ttlSeconds ? { ex: ttlSeconds } : undefined
    );
  } catch (error) {
    console.error("Redis saveToCache error:", error);
  }
}

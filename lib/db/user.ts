import { getCollection } from "./db";
import type { User } from "@/types";

async function getUsersCollection() {
    return await getCollection<User>("users");
}

export async function findUserByEmail(email: string) {
    const users = await getUsersCollection();
    return await users.findOne({ email });
}

export async function findUserByEmailAndCode(email: string, code: string) {
  const users = await getUsersCollection();
  return await users.findOne({ email, verificationCode: code });
}

export async function markUserAsVerified(email: string) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { email },
    {
      $set: {
        verified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    }
  );
}

export async function updateNewCode(email: string, newCode: string, expiresAt: Date) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { email },
    { $set: { verificationCode: newCode, verificationExpires: expiresAt.toISOString() } }
  );
}

export async function sendEmailVerificationCode(email: string, verificationCode: string) {
    console.log(`📧 Simulated: Sent verification code ${verificationCode} to ${email}`);
}

export async function createUser(user: User) {
    const users = await getUsersCollection();
    const result = await users.insertOne(user);

    return result.insertedId;
}
import { ObjectId } from "mongodb";

import { getCollection } from "./db";
import type { User } from "@/types";

async function getUsersCollection() {
  return await getCollection<User>("users");
}

export async function findUserById(id: string) {
  const users = await getUsersCollection();
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function findUserByEmail(email: string) {
  const users = await getUsersCollection();
  return await users.findOne({ email });
}

export async function findUserByEmailAndCode(email: string, code: string) {
  const users = await getUsersCollection();
  return await users.findOne({ email, verificationCode: code });
}

export async function findUserByResetToken(resetToken: string) {
  const users = await getUsersCollection();
  return await users.findOne({ resetToken });
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

export async function updateName(id: string, name: string) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name: name } }
  );
}

export async function updateEmail(id: string, email: string) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: { email: email } }
  );
}

export async function updateNewCode(
  email: string,
  newCode: string,
  expiresAt: Date
) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { email },
    { $set: { verificationCode: newCode, verificationExpires: expiresAt } }
  );
}

export async function updateToken(
  email: string,
  generatedToken: string,
  expiresAt: Date
) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { email },
    { $set: { resetToken: generatedToken, resetTokenExpires: expiresAt } }
  );
}

export async function updatePassword(
  resetToken: string,
  hashedPassword: string
) {
  const users = await getUsersCollection();
  return await users.updateOne(
    { resetToken },
    {
      $set: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    }
  );
}

export async function simulateSendEmailVerificationCode(
  email: string,
  verificationCode: string
) {
  console.log(
    `📧 Simulated: Sent verification code ${verificationCode} to ${email}`
  );
}

export async function createUser(user: User) {
  const users = await getUsersCollection();
  const result = await users.insertOne(user);

  return result.insertedId;
}

export async function deleteUserById(id: string) {
  const users = await getUsersCollection();
  return await users.deleteOne({ _id: new ObjectId(id) });
}

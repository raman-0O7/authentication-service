"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { db } from "@/lib/db";

export const newVerification = async (token : string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if(!existingToken) {
    return { error: "Token is invalid"};
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if(hasExpired) {
    await db.verificationToken.delete({
      where : { id: existingToken.id }
    });
    return { error: "Token is expired, login again"};
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if(!existingUser) {
    return { error: "Email does not exist"};
  }

  await db.user.update({
    where : { id : existingUser.id},
    data : {
      emailVerified: new Date(),
      email : existingToken.email
    }
  });

  await db.verificationToken.delete({
    where : { id : existingToken.id }
  });

  return { success: "Email Verified!"};
}
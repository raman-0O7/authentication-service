"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorToken, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/route";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values : z.infer<typeof LoginSchema>) => {
  const validatedSchema = LoginSchema.safeParse(values);

  if(!validatedSchema.success) {
    return { error: "Invalid Fields!"}
  }

  const { email, password, code } = validatedSchema.data;

  const existingUser = await getUserByEmail(email);
  if(!existingUser ||!existingUser?.email || !existingUser.password) {
    return { error : "Email does not exist"}
  }
  if(!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success : "Verification email sent"}
  }
  if(code) {
    const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

    if(!twoFactorToken) {
      return { error: "Invalid code!"};
    }
    if(twoFactorToken.token !== code) {
      return { error : "Invalid code"};
    }
    const hasExpired = new Date(twoFactorToken.expires) < new Date();
    if(hasExpired) {
      return { error : "Code is Expired"};
    }

    await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id}
    });

    const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
    if(twoFactorConfirmation) {
      await db.twoFactorConfirmation.delete({
        where: { id : twoFactorConfirmation.id}
      })
    }

    await db.twoFactorConfirmation.create({
      data : {
        userId: existingUser.id
      }
    });
  } else {
    if(existingUser.twoFactorEnabled && existingUser.email) {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorToken(existingUser.email, twoFactorToken.token);
      return { setTwoFactor : true};
    }
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo : DEFAULT_REDIRECT_AFTER_LOGIN
    })
  } catch (error) { 
    if(error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error : "Invalid Credentials" }
        }
        default : {
          return { error: "Something went wrong" }
        }
      }
    }
    throw error;
  }
}
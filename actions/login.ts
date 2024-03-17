"use server";

import { signIn } from "@/auth";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/route";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values : z.infer<typeof LoginSchema>) => {
  const validatedSchema = LoginSchema.safeParse(values);

  if(!validatedSchema.success) {
    return { error: "Invalid Fields!"}
  }

  const { email, password } = validatedSchema.data;
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
import Credentials from "next-auth/providers/credentials";
import {LoginSchema} from "@/schemas";
import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "./data/user";
import bcryptjs from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if(validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if(!user || !user.password) return null;

          const matchPassword = await bcryptjs.compare(password, user.password);
          if(matchPassword) return user;
        }
        return null;
      }
    })
  ],
} satisfies NextAuthConfig
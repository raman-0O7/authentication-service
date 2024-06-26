import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { getResetPasswordTokenByEmail } from '@/data/reset-password-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateTwoFactorToken = async (email:string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if(existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id}
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data:{
      email,
      token,
      expires
    }
  });
  return twoFactorToken;
} 

export const generateResetPasswordoken = async (email : string) => {
  const token = uuidv4();
  const expires= new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);
  
  if(existingToken) {
    await db.resetPasswordToken.delete({
      where : {
        id : existingToken.id
      }
    })
  }

  const resetPasswordToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires
    }
  });
  return resetPasswordToken;
}
export const generateVerificationToken = async (email : string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if(existingToken) {
    await db.verificationToken.delete({
      where : { id : existingToken.id}
    });
  }

  const verificationToken = await db.verificationToken.create({
    data : {
      email,token, expires
    }
  });
  return verificationToken;
}
import { auth, signOut } from '@/auth';
import React from 'react'

export default async function SettingPage() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form action={async () => {
        "use server";

        await signOut();
      }}>
        <button type='submit'>
          Sign-Out
        </button>
      </form>
    </div>
  );
}

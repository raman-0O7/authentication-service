"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";


export default  function SettingPage() {
  const session = useCurrentUser();

  async function onClick() {
    await logout();
  }
  return (
    <div className="">
        <button onClick={onClick}>
          Sign-Out
        </button>
    </div>
  );
}

"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
export const Social = () => {
  return (
    <div className="flex items-center w-full justify-center gap-x-2">
      <Button
        variant="outline"
        className="w-full"
        size={"lg"}
        onClick={() => {}}
      >
        <FcGoogle className="w-5 h-5"/>
      </Button>
      <Button
        variant="outline"
        className="w-full"
        size={"lg"}
        onClick={(() => {})}
      >
        <FaGithub className="w-5 h-5"/>
      </Button>
    </div>
  )
}
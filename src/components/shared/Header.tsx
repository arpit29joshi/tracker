"use client";
import React from "react";
import { Button } from "../ui/button";
import { errorMessage } from "@/helpers/utils";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

function Header() {
  const route = useRouter();
  const pathname = usePathname();
  const logout = async () => {
    try {
      const resData = await axios.put("/api/logout");
      if (resData.status === 200) {
        toast({
          title: "Logout successful",
          description: "You have been logged out.",
        });
        route.push("/login");
      }
    } catch (error) {
      console.log(error);
      const errMessage = errorMessage(error);
      toast({
        title: errMessage,
        description: "Please try again",
      });
    }
  };
  return (
    <div className="flex flex-row-reverse m-3 gap-2">
      <Button onClick={logout} variant={"ghost"} size={"icon"}>
        <LogOut className="cursor-pointer" />
      </Button>
      <Button
        onClick={() => {
          pathname === "/" ? route.push("/profile") : route.push("/");
        }}
        variant={"ghost"}
      >
        {pathname === "/" ? " Add Task +" : "Home"}
      </Button>
    </div>
  );
}

export default Header;

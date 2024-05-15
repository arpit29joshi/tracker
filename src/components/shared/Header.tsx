"use client";
import React from "react";
import { Button } from "../ui/button";
import { errorMessage } from "@/helpers/utils";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

function Header() {
  const route = useRouter();
  const logout = async () => {
    try {
      const resData = await axios.get("/api/logout");
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
    <div>
      <Button onClick={logout}>LogoOut</Button>
    </div>
  );
}

export default Header;

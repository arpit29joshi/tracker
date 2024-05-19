"use client";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/helpers/utils";
import axios from "axios";
import React, { useEffect } from "react";

function Profile() {
  const fetchUser = async () => {
    try {
      const response = await axios.post("/api/task");
      console.log(response);
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <h1>Profile</h1>
      <p>Profile Page</p>
    </div>
  );
}

export default Profile;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/helpers/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [data, setData] = React.useState<any>([]);
  const [userData, setUserData] = React.useState<any>(null);
  const [disable, setDisable] = useState(false);
  const [progress, setProgress] = React.useState(0);
  console.log(userData);
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/task");
      const useResponse = await axios.get("/api/user");
      if (response.status === 200) {
        setData(response?.data?.task);
        const taskList = response?.data?.task;
        const total = taskList.filter((item: any) => {
          return item.isCompleted === true;
        });
        setProgress((total.length / taskList.length) * 100);
      }

      if (useResponse.status === 200) setUserData(useResponse?.data?.data);
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
      });
    }
  };

  async function updateTask(itemID: string) {
    setDisable(true);
    try {
      const response = await axios.put("/api/updateTask", {
        id: itemID,
      });
      if (response.status === 200) {
        toast({
          title: response.data.message,
        });
        setData((prv: any) => {
          const newArray = prv.map((item: any) => {
            if (item._id === itemID) {
              const newObj = { ...item, isCompleted: !item.isCompleted };
              return newObj;
            }
            return item;
          });
          return newArray;
        });
        // TODO optimize this code
        const newArray = data.map((item: any) => {
          if (item._id === itemID) {
            const newObj = { ...item, isCompleted: !item.isCompleted };
            return newObj;
          }
          return item;
        });
        const total = newArray.filter((item: any) => {
          return item.isCompleted === true;
        });
        console.log(total);
        setProgress((total.length / newArray.length) * 100);
        console.log(
          userData.isAllTasksCompleted,
          (total.length / newArray.length) * 100 != 100
        );
        if (
          userData.isAllTasksCompleted &&
          (total.length / newArray.length) * 100 <= 100
        ) {
          await axios.get("/api/user/allTaskComplete");
          setUserData((prev: any) => {
            return { ...prev, isAllTasksCompleted: false };
          });
        }
        if ((total.length / newArray.length) * 100 === 100) {
          await axios.get("/api/user/allTaskComplete");
          setUserData((prev: any) => {
            return { ...prev, isAllTasksCompleted: true };
          });
        }
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
      });
    } finally {
      setDisable(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      {userData?.userName && <p>Welcome Back {userData?.userName} </p>}
      <p>
        Current Streak: {userData?.currentStreak && userData?.currentStreak}🔥
      </p>
      <p>
        Longest Streak: {userData?.longestStreak && userData?.longestStreak}🔥💪
      </p>
      <Progress value={progress} max={data.length} className="w-80" />
      <div>
        {data && data.length > 0 ? (
          data.map((item: any) => {
            return (
              <div className="flex items-center space-x-2" key={item._id}>
                <Checkbox
                  id="terms"
                  checked={item?.isCompleted}
                  onClick={() => updateTask(item._id)}
                  disabled={disable}
                />
                <Label htmlFor="terms">{item?.title}</Label>
              </div>
            );
          })
        ) : (
          <p>No Task Found</p>
        )}
      </div>
    </>
  );
}

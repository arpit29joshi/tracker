"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/helpers/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();
  const [data, setData] = React.useState<any>([]);
  const [userData, setUserData] = React.useState<any>(null);
  const [disable, setDisable] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setLoading] = React.useState(true);

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
    } finally {
      setLoading(false);
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
      <Header />
      <div className="flex flex-col items-center justify-center h-full">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <>
            {userData?.userName && (
              <p className="text-3xl mb-3 font-bold">
                Welcome Back {userData?.userName}{" "}
              </p>
            )}
            <p className="text-xl font-medium mb-2">
              Current Streak:{" "}
              {userData?.currentStreak && userData?.currentStreak}🔥
            </p>
            <p className="text-xl font-medium mb-3">
              Longest Streak:{" "}
              {userData?.longestStreak && userData?.longestStreak}
              🔥💪
            </p>
            <Progress
              value={progress}
              max={data.length}
              className="w-80 bg-[#2E2E2E]"
            />
            <div className="h-[500px] text-center overflow-y-auto">
              {data && data.length > 0 ? (
                data.map((item: any) => {
                  return (
                    <div
                      className="flex items-center space-x-2 my-5 justify-center"
                      key={item._id}
                    >
                      <Checkbox
                        id="terms"
                        checked={item?.isCompleted}
                        onClick={() => updateTask(item._id)}
                        disabled={disable}
                        className="border border-white rounded-md"
                      />
                      <Label htmlFor="terms" className="text-base">
                        {item?.title}
                      </Label>
                    </div>
                  );
                })
              ) : (
                <p className="text-xl font-medium m-3">No Task Found</p>
              )}
              <Button onClick={() => route.push("/profile")} variant={"ghost"}>
                Add Task
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

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
import { Task, User } from "@/type";

export default function Home() {
  const route = useRouter();
  const [data, setData] = React.useState<Array<Task>>([]);
  const [userData, setUserData] = React.useState<User | null>(null);
  const [disable, setDisable] = useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/task");
      const useResponse = await axios.get("/api/user");
      if (response.status === 200) {
        setData(response?.data?.task);
        if (useResponse.status === 200) {
          const totalTaskCompleted = useResponse?.data?.totalTaskCompleted;
          setUserData({
            ...useResponse?.data?.data,
            totalTaskCompleted: totalTaskCompleted,
          });
          setProgress((totalTaskCompleted / response?.data?.task.length) * 100);
        }
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
      });
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
        setData((prv: Task[]) => {
          const newArray = prv.map((item: Task) => {
            if (item._id === itemID) {
              const newObj = { ...item, isCompleted: !item.isCompleted };
              return newObj;
            }
            return item;
          });
          return newArray;
        });
        const totalTaskCompleted = Number(
          response?.data?.data?.totalTaskCompleted
        );
        const taskLength = Number(data.length);
        setProgress((totalTaskCompleted / taskLength) * 100);
        if (
          userData?.isAllTasksCompleted &&
          (totalTaskCompleted / taskLength) * 100 <= 100
        ) {
          await axios.get("/api/user/allTaskComplete");
          setUserData((prev: User | null) => {
            if (prev) {
              return {
                ...prev,
                isAllTasksCompleted: false,
                totalTaskCompleted: totalTaskCompleted,
              };
            }
            return null;
          });
        }
        if ((totalTaskCompleted / taskLength) * 100 === 100) {
          await axios.get("/api/user/allTaskComplete");
          setUserData((prev: User | null) => {
            if (prev) {
              return {
                ...prev,
                isAllTasksCompleted: true,
                totalTaskCompleted: totalTaskCompleted,
              };
            }
            return null;
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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 h-full max-h-[70vh]">
          {userData?.userName && (
            <p className="text-3xl mb-3 font-bold">
              Welcome Back {userData?.userName}{" "}
            </p>
          )}
          <p className="text-xl font-medium mb-2">
            Current Streak: {userData?.currentStreak && userData?.currentStreak}
            🔥
          </p>
          <p className="text-xl font-medium mb-3">
            Longest Streak: {userData?.longestStreak && userData?.longestStreak}
            🔥💪
          </p>
          <Progress
            value={progress}
            max={data.length}
            className="w-80 bg-[#2E2E2E]"
          />
          <div className=" text-center overflow-y-auto mt-2">
            {data && data.length > 0 ? (
              data.map((item: Task) => {
                return (
                  <div
                    className="flex items-center space-x-2 my-5 justify-center"
                    key={item._id}
                    onClick={() => updateTask(item._id)}
                  >
                    <Checkbox
                      id="terms"
                      checked={item?.isCompleted}
                      disabled={disable}
                      className="border border-white rounded-md"
                    />
                    <Label
                      htmlFor="terms"
                      className={`text-base ${
                        item?.isCompleted && "line-through"
                      }`}
                    >
                      {item?.title}
                    </Label>
                  </div>
                );
              })
            ) : (
              <p className="text-xl font-medium m-3">No Task Found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

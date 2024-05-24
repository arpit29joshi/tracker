"use client";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/helpers/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskDialog } from "@/components/ui/TaskDialog";
import Header from "@/components/shared/Header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Profile() {
  const route = useRouter();
  const [data, setData] = React.useState<any>([]);
  const [isLoading, setLoading] = React.useState(true);
  const [editMode, setEditMode] = useState({
    show: false,
    task: "",
  });
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/task");
      if (response.status === 200) setData(response?.data?.task);
    } catch (error) {
      const err = errorMessage(error);
      route.push("/");
      toast({
        title: err,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
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
        <div className="flex flex-col items-center mt-10 max-h-[90vh] overflow-auto">
          <p className="text-xl  m-3 font-bold">Your Tasks</p>
          <div className="max-h-[50VH] overflow-y-auto text-center mx-3 flex flex-col justify-center items-center">
            {data && data.length > 0 ? (
              data.map((item: any) => {
                return (
                  <div
                    className="flex items-center space-x-2 my-2"
                    key={item._id}
                    onClick={() => setEditMode({ show: true, task: item })}
                  >
                    <Label htmlFor="terms" className="text-base underline">
                      {item?.title}
                    </Label>
                    <Pencil size={12} />
                  </div>
                );
              })
            ) : (
              <p className="text-xl font-medium m-3">No Task Found</p>
            )}
          </div>

          {editMode.show && editMode.task && (
            <TaskDialog
              editMode={editMode}
              type={1}
              setData={setData}
              modalOpen={true}
              setEditMode={setEditMode}
            />
          )}
          <TaskDialog
            taskList={data}
            type={0}
            setData={setData}
            modalOpen={false}
          />
        </div>
      )}
    </>
  );
}

export default Profile;

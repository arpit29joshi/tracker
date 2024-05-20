"use client";
import { toast } from "@/components/ui/use-toast";
import { errorMessage } from "@/helpers/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskDialog } from "@/components/ui/TaskDialog";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

function Profile() {
  const [data, setData] = React.useState<any>([]);
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

      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Your Tasks</h4>
          {data && data.length > 0 ? (
            data.map((task: any) => {
              return (
                <div
                  key={task._id}
                  onClick={() => setEditMode({ show: true, task: task.title })}
                >
                  <div className="text-sm">{task.title}</div>
                  <Separator className="my-2" />
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </ScrollArea>
      {editMode.show && editMode.task && (
        <TaskDialog
          taskList={data}
          type={1}
          setData={setData}
          modalOpen={true}
          setEditMode={setEditMode}
        />
      )}
      <TaskDialog taskList={data} type={0} setData={setData} />
    </div>
  );
}

export default Profile;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "./use-toast";
import { errorMessage } from "@/helpers/utils";
import axios from "axios";

export function TaskDialog({
  taskList,
  type,
  setData,
  modalOpen,
  setEditMode,
}: any) {
  console.log(taskList);
  const [newTask, setNewTask] = useState(type === 0 ? "" : taskList?.title);
  const [disable, setDisable] = useState(taskList ? true : false);
  const [isDialogOpen, setIsDialogOpen] = useState(modalOpen ? true : false);
  async function addTask() {
    if (!newTask) return;
    setDisable(true);
    try {
      const response = await axios.post("/api/task", {
        title: newTask,
      });
      if (response.status === 201) {
        setData((prev: any) => [...prev, response?.data?.data]);
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
      });
    } finally {
      setDisable(false);
      setNewTask("");
      setIsDialogOpen(false);
    }
  }
  async function editTask() {
    if (!newTask) return;
    setDisable(true);
    try {
      const response = await axios.put("/api/task", {
        title: newTask,
        id: taskList._id,
      });
      if (response.status === 201) {
        console.log(response?.data?.data);
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
      });
    } finally {
      setDisable(false);
      setNewTask("");
      setIsDialogOpen(false);
    }
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen(false);
        setEditMode({ show: false, task: "" });
      }}
    >
      <DialogTrigger asChild>
        {type === 0 && <Button variant="outline">Add Task</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === 0 ? "Add Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {type === 0 ? "Add a new task" : "Edit a task"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Task
            </Label>
            <Input
              id="name"
              placeholder="Exercise"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={type === 0 ? addTask : () => {}}
            variant={"default"}
            disabled={disable || !newTask}
          >
            {type === 0 ? "Add Task" : "Edit Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

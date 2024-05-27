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
import { errorMessage } from "@/helpers/utils";
import { Task } from "@/type";
import axios from "axios";
import { useState } from "react";
import { toast } from "./use-toast";

interface TaskDialogProps {
  editMode?: {
    task: Task | null;
    show: boolean;
  };
  type: number;
  setData: React.Dispatch<React.SetStateAction<Task[]>>;
  modalOpen: boolean;
  setEditMode?: React.Dispatch<
    React.SetStateAction<{ task: Task | null; show: boolean }>
  >;
}

export function TaskDialog({
  editMode,
  type,
  setData,
  modalOpen,
  setEditMode = () => {},
}: TaskDialogProps) {
  const [newTask, setNewTask] = useState<string | null>(
    !modalOpen ? null : editMode?.task?.title ?? ""
  );
  const [disable, setDisable] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(modalOpen ?? false); // Initialize state with modalOpen or false
  async function addTask() {
    if (!newTask) return;
    setDisable(true);
    try {
      const response = await axios.post("/api/task", {
        title: newTask,
      });
      if (response.status === 201) {
        setData((prev: Task[]) => [...prev, response?.data?.data]);
        toast({
          title: response?.data?.message,
        });
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
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
        id: editMode?.task?._id,
      });
      if (response.status === 200) {
        setData((prev: Task[]) => {
          const newArray = prev.map((item: Task) => {
            if (item._id === editMode?.task?._id) {
              const newObj = { ...item, title: newTask };
              return newObj;
            }
            return item;
          });
          return newArray;
        });
        toast({
          title: response?.data?.message,
        });
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
      });
    } finally {
      setDisable(false);
      setNewTask("");
      setIsDialogOpen(false);
      setEditMode({ show: false, task: null });
    }
  }

  async function DeleteTask() {
    setDisable(true);
    try {
      const response = await axios.put("/api/task/delete", {
        id: editMode?.task?._id,
      });
      if (response.status === 201) {
        setData((prev: Task[]) => {
          const newArray = prev.filter((item: Task) => {
            return item._id !== editMode?.task?._id;
          });
          return newArray;
        });
        toast({
          title: response?.data?.message,
        });
      }
    } catch (error) {
      const err = errorMessage(error);
      toast({
        title: err,
        variant: "destructive",
      });
    } finally {
      setDisable(false);
      setNewTask("");
      setIsDialogOpen(false);
      setEditMode({ show: false, task: null });
    }
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open); // Properly handle the open state of the dialog
        if (!open) {
          setEditMode({ show: false, task: null });
          setNewTask("");
        }
      }}
    >
      <DialogTrigger asChild>
        {type === 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="mt-3"
          >
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black text-xl">
            {type === 0 ? "Add Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-base">
            {type === 0 ? "Add a new task" : "Edit a task"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-black ">
              Task
            </Label>
            <Input
              id="name"
              placeholder="Exercise"
              value={newTask || ""}
              onChange={(e) => setNewTask(e.target.value)}
              className="col-span-3 text-black"
            />
          </div>
        </div>
        <DialogFooter>
          {type != 0 && (
            <Button
              variant={"danger"}
              disabled={disable}
              onClick={() => DeleteTask()}
              className="max-sm:mt-5"
            >
              Delete Task
            </Button>
          )}
          <Button
            onClick={type === 0 ? addTask : editTask}
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

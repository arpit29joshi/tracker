"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { errorMessage } from "@/helpers/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignUp() {
  const route = useRouter();
  const [isLoading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const resData = await axios.post("/api/signup", values);
      if (resData.status === 201) {
        toast({
          title: "User created successfully",
          description: "We've created your account for you.",
        });
        route.push("/");
      }
    } catch (error) {
      console.log(error);
      const errMessage = errorMessage(error);
      toast({
        title: errMessage,
        description: "Something went wrong !!! Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  // ...

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex justify-center items-center text-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="Test"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="test@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="*******"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"ghost"} disabled={isLoading}>
              SignUp
            </Button>
          </form>
        </Form>
      </div>
      <Link href="/login" className="underline mt-2">
        Already have an account?
      </Link>
    </div>
  );
}

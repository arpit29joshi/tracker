"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const resData = await axios.post("/api/login", values);
      if (resData.status === 200) {
        toast({
          title: "Login successful",
          description: "Welocome back",
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
                      placeholder="*******"
                      className="text-black"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"ghost"} disabled={isLoading}>
              Login
            </Button>
          </form>
        </Form>
        {/* <Link href="/forgot-password">Forgot password?</Link> */}
      </div>
      <Link href="/signup" className="underline mt-2">
        Register
      </Link>
    </div>
  );
}

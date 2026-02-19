"use client";
import { Button } from "@/components/ui/button";
import { Google, FaceBook } from "@/components/ui/Custom_Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MathNoise from "@/components/ui/MathNoise";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import React from "react";
import { signIn } from "../utils";
import { FaXTwitter } from "react-icons/fa6";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { HEADER_MARGIN } from "@/lib/utils";
export default function Page() {
  const router = useRouter();
  const schema = z.object({
    usernameOrEmail: z
      .string()
      .min(2, "username should be at least 2 characters long")
      .max(100, "username should be at most 100 characters long"),
    password: z
      .string()
      .min(8, "Password is too short")
      .max(100, "Password is too long"),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await axios.post("/api/auth/signin/email_and_password", data);

      // Set the session on the client side
      if (res.data.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: res.data.session.access_token,
          refresh_token: res.data.session.refresh_token,
        });

        if (sessionError) {
          console.error("Error setting session:", sessionError);
          toast.error("Failed to set session. Please try again.");
          return;
        }

        // Verify the session was set
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        if (currentSession) {
          toast.success("Successfully signed in!");
          // Redirect to home page or dashboard
          router.push("/");
          router.refresh();
        } else {
          toast.error("Session not found. Please try again.");
        }
      } else {
        toast.error("No session received from server.");
      }
    } catch (err: any) {
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Sign in failed. Please try again.");
      }
      console.error("Sign in error:", err);
    }
  };
  return (
    <main
      className="flex justify-center items-center max-w-[1444]! px-0"
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
    >
      <section className="w-full lg:w-2/4 px-5 md:px-10 max-w-4xl my-auto ">
        {/* Heading */}
        <div>
          <h3 className="text-text">Get Started Now</h3>
          <p className="text-text-muted">
            Enter your credentials to create a new account
          </p>
        </div>

        {/* sign Up with Google or FaceBook section */}
        <section className="grid grid-cols-2 gap-6  mt-5 max-w-2xl mx-auto">
          <Button
            variant={"outline"}
            className="flex justify-center items-center gap-3 bg-card"
            onClick={() => signIn("google")}
          >
            <Google className="w-12 h-12" />
            Google
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center gap-3 bg-card"
            onClick={() => signIn("x")}
          >
            <FaXTwitter className="w-12 h-12 text-text" />X / Twitter
          </Button>
        </section>
        {/* Or */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-border-muted" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-background px-2 text-text-muted">Or</span>
          </div>
        </div>
        {/* sign Up with Email */}

        <form
          className="max-w-2xl mx-auto flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="usernameOrEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="usernameOREmail">
                  Username or email
                </FieldLabel>
                <div className="relative w-full">
                  <Input
                    {...field}
                    id="usernameOREmail"
                    aria-invalid={fieldState.invalid}
                    placeholder="piKiller or pikiller@gmail.com"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative w-full">
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="*********"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <div>
                  <Link href={"/forgot_password"} className="Link text-sm ">
                    Forgot password?{" "}
                  </Link>
                </div>
              </Field>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
        <div className="text-center text-xs my-4">
          Don't have an account?{" "}
          <Link href={"/sign_up"} className="Link">
            Sign Up
          </Link>
        </div>
      </section>
      <section className="h-full w-2/4 hidden lg:flex justify-center items-center bg-acc ent relative overflow-hidden select-none">
        {/* Shadow layer */}
        <h1 className="absolute text-[150px] font-bold text-primary opacity-30 blur-3xl scale-110 flex flex-col items-center pointer-events-none ">
          <span>
            <span className="text-[170px]">N</span>UM
          </span>
          <span>ITZ</span>
        </h1>

        {/* Main text */}
        <h1 className="text-[150px] font-bold flex flex-col items-center z-50">
          <div>
            <span className="text-[190px]">N</span>UM
          </div>
          <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <Plus strokeWidth={6} size={50} className="text-primary" />
              <div className="w-6 h-20 bg-foreground"></div>
            </div>
            TZ
          </div>
        </h1>

        <MathNoise />
      </section>
    </main>
  );
}

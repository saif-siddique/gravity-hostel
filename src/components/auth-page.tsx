"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { FloatingPaths } from "@/components/floating-paths";
import Link from "next/link";
import { Input } from "./ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { LoginSchema } from "@/schemas/LoginSchema";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { useState } from "react";
import Loader from "@/helper/Loader";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface UserDetails {
  email: string;
  fullName: string;
  isAdmin: boolean;
  _id: string;
}

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof LoginSchema>) {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", formData);

      if (response.data.success) {
        const userData: UserDetails = response.data.data

        if (!userData) {
          throw new Error("User data missing from server response");
        }
        
        localStorage.setItem("_id", userData._id);
        localStorage.setItem(
          "data",
          JSON.stringify({
            fullName: userData.fullName,
            email: userData.email,
            isAdmin: userData.isAdmin
          }),
        );

        if (userData.isAdmin) {
          return router.push("/dashboard/a");
        } else {
          return router.push("/dashboard/s");
        }
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        <Logo className="mr-auto h-5" />

        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;This Platform has helped me to save time and serve my
              clients faster than ever before.&rdquo;
            </p>
            <footer className="font-mono font-semibold text-sm">
              ~ Ali Hassan
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="-z-10 absolute inset-0 isolate opacity-60 contain-strict"
        >
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>
        <Button asChild className="absolute top-7 left-5" variant="ghost">
          <Link href="/home">
            <ChevronLeftIcon />
            Home
          </Link>
        </Button>
        <div className="mx-auto space-y-4 sm:w-sm">
          <Logo className="h-5 lg:hidden" />
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl tracking-wide">
              Sign In or Join Now!
            </h1>
            <p className="text-base text-muted-foreground">
              login your Gravity account.
            </p>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="h-px w-full bg-border" />
            <span className="px-2 text-muted-foreground text-xs">OR</span>
            <div className="h-px w-full bg-border" />
          </div>

          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="example@gmail.com"
                      autoComplete="off"
                    />
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
                    <FieldLabel htmlFor="form-rhf-demo-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <Button disabled={isLoading} type="submit" form="login-form">
            {isLoading && <Loader2 className="animate-spin" />}Submit
          </Button>
          <p className="mt-8 text-muted-foreground text-sm">
            By clicking continue, you agree to our{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="/noavaialbe"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="/do-you-really-think-that-we-will-make-it"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

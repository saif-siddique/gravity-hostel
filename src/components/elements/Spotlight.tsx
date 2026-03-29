import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../ui/spotlight";
import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function SpotlightPreview() {
  return (
    <div className="relative flex min-h-[90vh] w-full overflow-hidden bg-background antialiased">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-linear-to-tr from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-size-[60px_60px] select-none opacity-[0.03]",
          "bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]",
        )}
      />

      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="currentColor"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32 md:py-40 flex flex-col items-center justify-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <p className="text-[11px]">Trusted by 500+ Students Across Pakistan</p>
        </div>

        {/* Main Heading */}
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">Next-Generation</span>
          <span className="block mt-2 bg-linear-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Hostel Management
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground md:text-xl leading-relaxed">
          Experience the future of student living with AI-powered management,
          seamless automation, and enterprise-grade security. Built for scale,
          designed for comfort.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button asChild size="lg" className="h-12 px-8 text-base font-medium rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Link href="/home/contact">
              Get Enroll Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-col items-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Trusted by Hostel Leaders</p>
          <div className="flex items-center gap-8 opacity-50">
            <div className="text-xl font-bold text-muted-foreground ">Taqwa Hostel</div>
            <div className="text-xl font-bold text-muted-foreground">Rehmani Hostel</div>
            <div className="text-xl font-bold text-muted-foreground hidden sm:block">Subhan Hostel</div>
          </div>
        </div>
      </div>
    </div>
  );
}

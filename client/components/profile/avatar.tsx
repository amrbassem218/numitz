"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

interface AvatarImageProps extends React.ComponentPropsWithoutRef<"img"> {
  className?: string;
}

export function AvatarImage({ className, alt, ...props }: AvatarImageProps) {
  return <img className={cn("absolute inset-0 object-cover w-full h-full", className)} alt={alt ?? ""} {...props} />;
}

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
}

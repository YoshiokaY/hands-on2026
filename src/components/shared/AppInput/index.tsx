"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AppInputProps extends React.ComponentProps<typeof Input> {
  error?: string;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <Input
          ref={ref}
          className={cn(error && "border-destructive", className)}
          aria-invalid={!!error}
          {...props}
        />
        {error && <span className="text-destructive text-sm">{error}</span>}
      </div>
    );
  }
);

AppInput.displayName = "AppInput";

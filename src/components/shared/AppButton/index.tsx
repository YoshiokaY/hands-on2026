"use client";

import { forwardRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button> & VariantProps<typeof buttonVariants>;

export interface AppButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, isLoading, disabled, children, ...props }, ref) => {
    return (
      <Button ref={ref} className={cn(className)} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </span>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AppButton.displayName = "AppButton";

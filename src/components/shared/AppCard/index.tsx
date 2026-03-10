import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface AppCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AppCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  onClick,
}: AppCardProps) {
  const isClickable = !!onClick;

  return (
    <Card
      className={cn(
        isClickable &&
          "focus-visible:ring-ring cursor-pointer transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:outline-none",
        className
      )}
      onClick={onClick}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {(title || description || action) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

// Re-export primitives for advanced usage
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-white/10 bg-ocean-blue/40 backdrop-blur-md shadow-xl",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };

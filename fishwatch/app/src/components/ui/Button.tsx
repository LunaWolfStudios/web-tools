import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-neon-cyan text-deep-ocean hover:bg-neon-cyan/90 shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)]":
              variant === "primary",
            "bg-ocean-blue text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/10 hover:border-neon-cyan/60":
              variant === "secondary",
            "bg-alert-red/10 text-alert-red border border-alert-red/30 hover:bg-alert-red/20 hover:border-alert-red/60 shadow-[0_0_10px_rgba(255,42,109,0.2)]":
              variant === "danger",
            "hover:bg-white/5 text-slate-300 hover:text-white": variant === "ghost",
            "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300": variant === "outline",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

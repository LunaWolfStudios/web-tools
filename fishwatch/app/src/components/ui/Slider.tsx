import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {(label || valueDisplay) && (
          <div className="flex justify-between text-sm">
            {label && <span className="text-slate-400 font-medium">{label}</span>}
            {valueDisplay && (
              <span className="text-neon-cyan font-mono">{valueDisplay}</span>
            )}
          </div>
        )}
        <input
          type="range"
          ref={ref}
          className={cn(
            "w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };

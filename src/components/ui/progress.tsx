import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    onSeek?: (value: number) => void;
  }
>(({ className, value, onSeek, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(Math.min(100, Math.max(0, percent * 100)));
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-secondary cursor-pointer",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
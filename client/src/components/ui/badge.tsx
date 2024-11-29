import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const getRandomLightColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)];
  }
  return color;
};

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
  {
    variants: {
      variant: {
        default: "border-transparent text-zinc-50 shadow hover:bg-zinc-900/80",
        secondary: "border-transparent text-zinc-900 hover:bg-zinc-100/80",
        destructive:
          "border-transparent text-zinc-50 shadow hover:bg-red-500/80",
        outline: "text-zinc-950 dark:text-zinc-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const backgroundColor = React.useMemo(() => getRandomLightColor(), []);

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{ backgroundColor }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

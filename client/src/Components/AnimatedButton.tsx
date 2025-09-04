import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const animatedButtonVariants = cva(
  "relative overflow-hidden transition-all duration-300 ease-spring active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary hover:shadow-glow hover:scale-105",
        glass:
          "bg-glass-bg/50 border border-glass-border backdrop-blur-md hover:bg-glass-bg/70 hover:shadow-soft",
        ghost: "bg-transparent hover:bg-secondary/20 hover:backdrop-blur-sm",
        destructive:
          "bg-destructive hover:bg-destructive/80 hover:shadow-lg shadow-destructive/20",
        outline:
          "border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-sm",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
      glow: {
        none: "",
        subtle: "hover:animate-glow-pulse",
        strong: "animate-glow-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  },
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  children: React.ReactNode;
}

export function AnimatedButton({
  className,
  variant,
  size,
  glow,
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <button
      className={cn(animatedButtonVariants({ variant, size, glow, className }))}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  );
}

export default AnimatedButton;

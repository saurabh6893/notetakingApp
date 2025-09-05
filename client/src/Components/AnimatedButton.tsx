import React, { useRef } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { useAdvancedGSAP } from "../hooks/useAdvancedGSAP";

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
  const btnRef = useRef<HTMLButtonElement>(null);
  const { animateButtonHover } = useAdvancedGSAP();

  return (
    <button
      ref={btnRef}
      className={animatedButtonVariants({ variant, size, glow, className })}
      onMouseEnter={() => {
        if (btnRef.current) animateButtonHover(btnRef.current, true);
      }}
      onMouseLeave={() => {
        if (btnRef.current) animateButtonHover(btnRef.current, false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default AnimatedButton;

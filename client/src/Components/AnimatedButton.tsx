import React, { useRef } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { useAdvancedGSAP } from "../hooks/useAdvancedGSAP";
import { cn } from "../lib/utils";

const animatedButtonVariants = cva(
  "relative overflow-hidden transition-all duration-300 ease-spring active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-white border border-gray-200 text-black hover:bg-gray-50 shadow-sm",
        glass:
          "bg-white/80 border border-gray-100 backdrop-blur-sm text-black hover:bg-white/90 shadow-md",

        ghost: "bg-transparent hover:bg-gray-100 text-black",

        destructive:
          "bg-white border border-gray-300 text-rose-700 hover:bg-rose-50 shadow-sm",
        outline:
          "border-2 border-gray-300 bg-transparent text-black hover:bg-gray-100",
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
  isLoading?: boolean;
}

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export function AnimatedButton({
  className,
  isLoading = false,
  variant,
  size,
  glow,
  children,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { animateButtonHover } = useAdvancedGSAP();

  return (
    <button
      disabled={isLoading || disabled}
      ref={btnRef}
      className={cn(
        animatedButtonVariants({ variant, size, glow }),
        disabled ? "opacity-60 cursor-not-allowed" : "",
        className,
      )}
      onMouseEnter={() => {
        if (btnRef.current) animateButtonHover(btnRef.current, true);
      }}
      onMouseLeave={() => {
        if (btnRef.current) animateButtonHover(btnRef.current, false);
      }}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

export default AnimatedButton;

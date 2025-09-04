import React from "react";
import { cn } from "../lib/utils";

export type GlassCardVariant = "default" | "purple" | "blue" | "sunset";
export type GlassCardBlur = "sm" | "md" | "lg";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: GlassCardVariant;
  blur?: GlassCardBlur;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  style,
  variant = "default",
  blur = "md",
  onClick,
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-gradient-glass border-glass-border",
    purple:
      "bg-gradient-to-br from-accent-purple/20 to-accent-pink/10 border-accent-purple/30",
    blue: "bg-gradient-to-br from-accent-blue/20 to-accent-purple/10 border-accent-blue/30",
    sunset:
      "bg-gradient-to-br from-accent-orange/20 to-accent-pink/10 border-accent-orange/30",
  };
  const blurStyles = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-opacity-30 shadow-glass",
        "transition-all duration-500 ease-smooth",
        "hover:shadow-glow hover:scale-[1.02]",
        variantStyles[variant],
        blurStyles[blur],
        className,
      )}
      style={style}
      onClick={onClick}
    >
      <div className="relative z-10 p-6 h-full">{children}</div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
    </div>
  );
}

export default GlassCard;

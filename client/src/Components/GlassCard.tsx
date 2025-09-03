import React from "react";
import "./GlassCard.css";

interface GlassCardProps {
  accentColor: string;
  children: React.ReactNode;
}

export function GlassCard({ accentColor, children }: GlassCardProps) {
  return (
    <div className="glass-card" style={{ borderLeftColor: accentColor }}>
      {children}
    </div>
  );
}

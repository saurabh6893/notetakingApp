// client/src/Components/AnimatedButton.tsx
import React from "react";
import gsap from "gsap";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedButton({
  children,
  className,
  ...props
}: AnimatedButtonProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const onEnter = () => {
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  };

  const onLeave = () => {
    if (btnRef.current) {
      gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: "power1.out" });
    }
  };

  return (
    <button
      ref={btnRef}
      {...props}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
    >
      {children}
    </button>
  );
}

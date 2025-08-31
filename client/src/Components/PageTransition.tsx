// client/src/Components/PageTransition.tsx
import React, { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const played = React.useRef(false);

  useEffect(() => {
    if (containerRef.current && !played.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
      played.current = true;
    }
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

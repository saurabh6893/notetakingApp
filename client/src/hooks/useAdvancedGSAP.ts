import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
type GSAPTimeline = ReturnType<typeof gsap.timeline>;
export const useAdvancedGSAP = () => {
  const timelineRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    const tl = timelineRef.current;
    return () => {
      if (tl) {
        tl.kill();
      }
    };
  }, []);

  const animateButtonHover = useCallback(
    (element: HTMLElement, isHover: boolean) => {
      if (isHover) {
        gsap.to(element, {
          scale: 1.05,
          y: -2,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [],
  );

  // NEW: Stagger animation for task cards
  const animateTasksStagger = useCallback(
    (selector: string, delay: number = 0) => {
      return gsap.fromTo(
        selector,
        {
          y: 80,
          opacity: 0,
          scale: 0.8,
          rotationX: -10,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          delay,
          stagger: {
            amount: 0.6, // Total time to stagger all cards
            from: "start",
            ease: "power2.out",
          },
          ease: "back.out(1.4)", // Springy entrance
        },
      );
    },
    [],
  );

  return {
    timelineRef,
    animateButtonHover,
    animateTasksStagger,
  };
};

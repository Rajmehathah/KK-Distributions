import { useEffect } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';

/**
 * Premium Magnetic Button Microinteraction Hook
 * Attracts the button element slightly toward the mouse cursor when hovering
 * and springs back using elastic easing upon exit.
 */
export const useMagneticButton = (
  ref: RefObject<HTMLElement | null>,
  strength: number = 25
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const bound = el.getBoundingClientRect();
      const x = e.clientX - (bound.left + bound.width / 2);
      const y = e.clientY - (bound.top + bound.height / 2);

      gsap.to(el, {
        x: x * (strength / 100),
        y: y * (strength / 100),
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.1, 0.4)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, strength]);
};

/**
 * Scroll Reveal / Entry Fade Animation Hook
 * Fades in and slides an element from a specified offset direction.
 */
export const useScrollReveal = (
  ref: RefObject<HTMLElement | null>,
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  delay: number = 0
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offsetMap = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { y: 0, x: 50 },
      right: { y: 0, x: -50 },
    };

    const offset = offsetMap[direction];

    // Initial state
    gsap.set(el, {
      opacity: 0,
      y: offset.y,
      x: offset.x,
      filter: 'blur(5px)'
    });

    // Animate
    gsap.to(el, {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      duration: 1.0,
      delay,
      ease: 'power4.out',
    });
  }, [ref, direction, delay]);
};

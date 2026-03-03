"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Quando o elemento entra na tela (visível)
        if (entry.isIntersecting) {
          // Pequeno delay opcional para efeito de cascata
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect(); // Anima apenas na primeira vez que aparece
        }
      },
      { 
        threshold: 0.1, // Dispara quando 10% do item estiver visível
        rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes de chegar no fundo da tela
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        className
      )}
    >
      {children}
    </div>
  );
}
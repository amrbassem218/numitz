"use client";

import React, { useEffect, useRef } from "react";

// MathJax type declarations
// declare global {
//   interface Window {
//     MathJax?: {
//       typesetPromise?: (elements?: Element[]) => Promise<void>;
//       typeset?: (elements?: Element[]) => void;
//       startup?: {
//         defaultPageReady?: () => Promise<void>;
//       };
//     };
//   }
// }

interface MathJaxContentProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Wrapper component that automatically renders MathJax content.
 * Use this for static content that doesn't change after initial load.
 *
 * @example
 * <MathJaxContent>
 *   <p>The formula $E = mc^2$ is famous.</p>
 * </MathJaxContent>
 */
export function MathJaxContent({
  children,
  className,
  as: Component = "div",
}: MathJaxContentProps) {
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Wait a bit for MathJax to be ready and DOM to update
    const timer = setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        window.MathJax &&
        contentRef.current
      ) {
        if (window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([contentRef.current]).catch((err) => {
            console.error("MathJax typeset error:", err);
          });
        } else if (window.MathJax.typeset) {
          window.MathJax.typeset([contentRef.current]);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [children]); // Re-render if children change

  return React.createElement(
    Component,
    { ref: contentRef, className },
    children,
  );
}

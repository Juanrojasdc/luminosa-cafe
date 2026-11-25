import { useEffect, useRef } from "react";

function useScrollReveal(ready = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!ready || !window.IntersectionObserver) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const sections = containerRef.current?.querySelectorAll("[data-scroll-reveal]");
    if (!sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -25% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ready]);

  return containerRef;
}

export default useScrollReveal;

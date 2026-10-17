"use client";
import { useEffect, useState } from "react";

// Counts distinct loading.tsx fallback elements that mount after the last click.
export function SkeletonCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const seen = new WeakSet<Element>();
    let mounted = 0;
    const reset = (event: MouseEvent) => { if ((event.target as Element).closest("a")) { mounted = 0; setCount(0); } };
    document.addEventListener("click", reset, true);
    const observer = new MutationObserver(() => {
      for (const element of document.querySelectorAll("[data-skeleton]")) {
        if (seen.has(element)) continue;
        seen.add(element);
        mounted += 1;
        setCount(mounted);
        console.info(`loading.tsx fallback element #${mounted} mounted for ${location.pathname}`);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); document.removeEventListener("click", reset, true); };
  }, []);
  return <output id="skeleton-count" style={{ position: "fixed", right: 8, bottom: 8 }}>fallbacks mounted since last click: {count}</output>;
}

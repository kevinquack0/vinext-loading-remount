import type { ReactNode } from "react";
import { SkeletonCounter } from "./skeleton-counter";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><SkeletonCounter />{children}</body></html>;
}

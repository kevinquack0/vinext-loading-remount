import Link from "next/link";
import type { ReactNode } from "react";
import { sleep } from "../sleep";

// Stands in for an awaited session check. No Suspense, no fallback of its own.
export default async function SlowLayout({ children }: { children: ReactNode }) {
  await sleep(800);
  return <div><nav><Link href="/slow-layout/a">A</Link> · <Link href="/slow-layout/b">B</Link></nav>{children}</div>;
}

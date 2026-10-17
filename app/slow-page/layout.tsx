import Link from "next/link";
import type { ReactNode } from "react";

export default function FastLayout({ children }: { children: ReactNode }) {
  return <div><nav><Link href="/slow-page/a">A</Link> · <Link href="/slow-page/b">B</Link></nav>{children}</div>;
}

import Link from "next/link";

export default function Home() {
  return <main><Link href="/slow-layout/a">Slow layout</Link> · <Link href="/slow-page/a">Slow page</Link></main>;
}

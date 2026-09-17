import Link from "next/link";

export default function NotFound() {
  return (
    <main data-era="glass" className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-[520px] text-center">
        <p className="label-mono m-0 text-fg-muted">404</p>
        <h1 className="m-0 mt-3 font-serif text-[clamp(40px,7vw,80px)] leading-[0.95] tracking-[-0.02em]">Nothing is filed here.</h1>
        <p className="m-0 mt-4 text-[15px] leading-relaxed text-fg-muted">The archive covers 2005 through 2026. This page is not one of them.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href="/" className="btn-era">All years</Link>
          <Link href="/timeline" className="btn-ghost">Timeline</Link>
        </div>
      </div>
    </main>
  );
}

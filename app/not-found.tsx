import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <main data-era="xp" className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="surface w-full max-w-[440px]" role="alertdialog" aria-labelledby="nf-title">
        <div className="surface-chrome">
          <Icon name="window" size={14} />
          <span id="nf-title" className="surface-title font-semibold">Archive</span>
          <div className="dots" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="surface-body flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-2 text-[#1b1300]">
            <Icon name="info" size={20} />
          </span>
          <div>
            <p className="m-0 text-[14px] font-semibold">The file you are looking for has been moved or deleted.</p>
            <p className="m-0 mt-1 text-[13px] text-surface-fg-muted">The archive only covers 2005 through 2026.</p>
            <div className="mt-4 flex gap-2">
              <Link href="/year/2005" className="btn-era">Open 2005</Link>
              <Link href="/timeline" className="btn-ghost text-surface-fg">Timeline</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

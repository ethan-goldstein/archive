"use client";

import { Icon } from "@/components/ui/Icon";
import { useUi } from "@/lib/ui/useUi";
import { useGlobalEra } from "@/lib/era/EraContext";
import { eraById } from "@/lib/content/eras";

/** "Done" / "Opening 2013…" with Win98 progress blocks; the era name on the right. Desktop only. */
export function StatusBar() {
  const { status, busy } = useUi();
  const era = eraById(useGlobalEra());
  return (
    <div className="sticky bottom-0 z-40 hidden h-[var(--status-h)] items-stretch gap-1 border-t border-[var(--os-light)] bg-[var(--os-face)] px-1 md:flex" aria-live="polite">
      <div className="os-status bevel-thin flex min-w-0 flex-1 items-center gap-2 px-2">
        <span className="truncate">{status}</span>
      </div>
      <div className="os-progress bevel-thin w-[110px]" data-busy={busy} aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="os-status bevel-thin hidden items-center gap-2 px-2 lg:flex">
        <Icon name="sparkle" size={10} />
        <span>{era.name}</span>
      </div>
      <div className="os-status bevel-thin flex items-center gap-2 px-2">
        <Icon name="globe" size={10} />
        <span>Internet zone</span>
      </div>
    </div>
  );
}

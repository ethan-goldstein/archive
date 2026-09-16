"use client";

import { usePath } from "@/lib/hooks/usePath";
import { Icon } from "@/components/ui/Icon";
import { titleForPath } from "@/lib/browser/title";
import { useSettings } from "@/lib/settings/SettingsContext";
import { uiStore } from "@/lib/ui/uiStore";
import { cn } from "@/lib/cn";

interface Props { onMinimize: () => void; onClose: () => void }

export function TitleBar({ onMinimize, onClose }: Props) {
  const pathname = usePath();
  const { os } = useSettings();
  const title = titleForPath(pathname);
  const mac = os === "mac";

  return (
    <div className={cn("os-title flex h-8 items-center gap-2 px-2 md:h-7", mac && "justify-between")}>
      {mac ? (
        <button type="button" onClick={onClose} className="os-btn" aria-label="Close window" />
      ) : (
        <Icon name="globe" size={14} aria-hidden="true" />
      )}
      <span className={cn("os-title-text min-w-0 flex-1 truncate", mac && "flex-none text-center")}>{title}</span>
      {mac ? (
        <span className="flex gap-[6px]">
          <button type="button" onClick={() => uiStore.toggleMaximized()} className="os-btn" aria-label="Zoom window" />
          <button type="button" onClick={onMinimize} className="os-btn" aria-label="Collapse window" />
        </span>
      ) : (
        <span className="ml-auto flex gap-[3px]">
          <button type="button" onClick={onMinimize} className="os-btn bevel-out" aria-label="Minimize window"><span aria-hidden="true">_</span></button>
          <button type="button" onClick={() => uiStore.toggleMaximized()} className="os-btn bevel-out" aria-label="Maximize window"><span aria-hidden="true">□</span></button>
          <button type="button" onClick={onClose} className="os-btn bevel-out ml-[2px]" aria-label="Close window"><span aria-hidden="true">×</span></button>
        </span>
      )}
    </div>
  );
}

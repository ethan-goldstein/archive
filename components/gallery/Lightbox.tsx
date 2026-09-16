"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { lightboxStore } from "@/lib/ui/lightboxStore";
import { useSyncExternalStore } from "react";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import { dur, ease } from "@/lib/motion";
import { asset } from "@/lib/basePath";

export function Lightbox() {
  const s = useSyncExternalStore(lightboxStore.subscribe, lightboxStore.get, lightboxStore.getServer);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const photo = s.photos[s.index];

  useKeyboard(
    (e) => {
      if (!s.open) return;
      if (e.key === "Escape") lightboxStore.close();
      else if (e.key === "ArrowRight") lightboxStore.go(1);
      else if (e.key === "ArrowLeft") lightboxStore.go(-1);
    },
    [s.open],
    true,
  );

  useEffect(() => {
    if (!s.open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [s.open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {s.open && photo ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${s.index + 1} of ${s.photos.length}: ${photo.alt}`}
          className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.base }}
          onClick={() => lightboxStore.close()}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/80" onClick={(e) => e.stopPropagation()}>
            <span className="label-mono">{s.year} · from the camera roll · {s.index + 1} / {s.photos.length}</span>
            <button ref={closeBtn} type="button" onClick={() => lightboxStore.close()} className="btn-ghost h-9 w-9 justify-center !px-0 text-white" aria-label="Close">
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-16" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={photo.id}
              layoutId={`photo-${photo.id}`}
              className="relative max-h-full w-full"
              style={{ aspectRatio: `${photo.width} / ${photo.height}`, maxWidth: `min(100%, calc((100dvh - 180px) * ${photo.width / photo.height}))` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) lightboxStore.go(1);
                else if (info.offset.x > 60) lightboxStore.go(-1);
              }}
              transition={{ duration: dur.base, ease: ease.outQuart }}
            >
              <Image src={asset(photo.src)} alt={photo.alt} fill sizes="100vw" className="object-contain" priority />
            </motion.div>
            {s.photos.length > 1 ? (
              <>
                <button type="button" onClick={() => lightboxStore.go(-1)} className="btn-ghost absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 justify-center !px-0 text-white md:flex" aria-label="Previous photo">
                  <Icon name="arrow-left" size={18} />
                </button>
                <button type="button" onClick={() => lightboxStore.go(1)} className="btn-ghost absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 justify-center !px-0 text-white md:flex" aria-label="Next photo">
                  <Icon name="arrow-right" size={18} />
                </button>
              </>
            ) : null}
          </div>
          <div className="px-4 py-4 text-white" onClick={(e) => e.stopPropagation()}>
            <p className="m-0 font-serif text-[18px] italic leading-snug">{photo.caption ?? photo.alt}</p>
            <p className="label-mono m-0 mt-1 text-white/60">
              {photo.takenAt ?? s.year}
              {photo.tags.length ? ` · ${photo.tags.map((t) => `#${t}`).join(" ")}` : ""}
              <span className="ml-3 hidden md:inline">← → · esc</span>
            </p>
          </div>
          {s.photos.slice(Math.max(0, s.index - 1), s.index + 2).map((p) => (
            <link key={p.id} rel="prefetch" as="image" href={asset(p.src)} />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

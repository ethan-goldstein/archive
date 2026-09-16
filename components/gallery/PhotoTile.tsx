"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Photo } from "@/lib/content/schema";
import { lightboxStore } from "@/lib/ui/lightboxStore";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/basePath";

interface Props {
  photo: Photo;
  photos: Photo[];
  index: number;
  year: number;
  sizes: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

/** One photo. Shared by every gallery style; opens the Lightbox with a shared-element transition. */
export function PhotoTile({ photo, photos, index, year, sizes, aspect, className, priority, children }: Props) {
  return (
    <motion.button
      type="button"
      layoutId={`photo-${photo.id}`}
      onClick={() => lightboxStore.open(photos, index, year)}
      className={cn("photo-fx group relative block w-full overflow-hidden bg-bg-deep text-left", className)}
      style={{ aspectRatio: aspect ?? `${photo.width} / ${photo.height}` }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      aria-label={`Open photo: ${photo.alt}`}
    >
      <Image
        src={asset(photo.src)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={photo.blurDataURL ? "blur" : "empty"}
        blurDataURL={photo.blurDataURL}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {children}
    </motion.button>
  );
}

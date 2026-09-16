import type { Transition, Variants } from "motion/react";

export const dur = { fast: 0.15, base: 0.3, slow: 0.6, cinematic: 1 } as const;
export const ease = {
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOutQuint: [0.83, 0, 0.17, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
};
export const spring = {
  snappy: { type: "spring", stiffness: 500, damping: 40, mass: 0.8 } as Transition,
  soft: { type: "spring", stiffness: 200, damping: 28 } as Transition,
  drawer: { type: "spring", stiffness: 380, damping: 36 } as Transition,
};

/** Content rises 12px and fades in. The house grammar. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.outQuart } },
  exit: { opacity: 0, y: -8, transition: { duration: dur.fast, ease: ease.outQuart } },
};

/** Surfaces "open" like a folder: 0.98 -> 1 with a fade. */
export const open: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: dur.base, ease: ease.outQuart } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: dur.fast } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.base } },
  exit: { opacity: 0, transition: { duration: dur.fast } },
};

export const stagger = (delay = 0.05): Transition => ({ staggerChildren: delay, delayChildren: 0.05 });

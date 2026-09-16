import type { SVGProps } from "react";
import type { IconName } from "@/lib/content/schema";

/**
 * The archive's own icon set: 24×24, 1.75 stroke, round caps. Drawn here, not lifted from any OS.
 * Keep shapes simple; they read at 16px inside chips and at 48px in the Time Capsule.
 */
const P: Record<IconName, string> = {
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  floppy: "M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-6h8v6",
  cd: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 6a6 6 0 0 1 6 6",
  cassette: "M3 6h18v12H3zM7 12a2 2 0 1 0 0 .01M17 12a2 2 0 1 0 0 .01M9 12h6M6 18l2-3h8l2 3",
  vinyl: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 7a5 5 0 0 1 5 5M12 17a5 5 0 0 1-5-5",
  ipod: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 5h8v6H8zM12 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  "ipod-touch": "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM7 5h10v13H7zM12 20h.01",
  iphone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM10 3h4M11 19h2",
  "flip-phone": "M8 3h8a1 1 0 0 1 1 1v6H7V4a1 1 0 0 1 1-1zM7 12h10v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zM9 14h2M13 14h2M9 17h2M13 17h2M10 10l-1 2M14 10l1 2",
  phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
  tablet: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 18h.01",
  laptop: "M4 5h16v11H4zM2 19h20M4 16l-2 3M20 16l2 3",
  desktop: "M3 4h18v12H3zM9 20h6M12 16v4",
  crt: "M3 4h18v13H3zM6 7h12v7H6zM9 20h6M8 17l-1 3M16 17l1 3",
  tv: "M3 6h18v12H3zM8 21h8M8 3l4 3 4-3",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM17 10h.01",
  camcorder: "M3 8h11v9H3zM14 11l7-3v10l-7-3M6 5h6",
  film: "M4 4h16v16H4zM4 8h16M4 12h16M4 16h16M8 4v16M16 4v16",
  polaroid: "M5 3h14v18H5zM7 5h10v10H7zM9 18h6",
  ds: "M4 3h16v8H4zM4 13h16v8H4zM7 7h10M7 17h3M17 16v2M16 17h2M9 16v2",
  wii: "M9 2h6v20H9zM12 5h.01M11 9h2M11 12h2M12 15h.01M12 18h.01",
  xbox: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM7 6c3 2 5 5 5 8M17 6c-3 2-5 5-5 8M6 17c2-3 4-5 6-5s4 2 6 5",
  playstation: "M9 4v15l4 1V6l3 1v7l3-1V6zM3 16l6 2v-3zM13 20l8-3v-3l-8 3",
  psp: "M2 7h20v10H2zM8 9h8v6H8zM5 12h.01M19 11h.01M19 13h.01",
  switch: "M9 3h2v18H9a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM13 3h2a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-2zM7 8a1 1 0 1 0 0 .01M16 15a1 1 0 1 0 0 .01",
  controller: "M6 8h12l3 8a2 2 0 0 1-3 2l-3-3H9l-3 3a2 2 0 0 1-3-2zM8 11v3M6.5 12.5h3M15 11h.01M17 13h.01",
  arcade: "M5 3h14v18H5zM8 6h8v5H8zM10 15h.01M14 15h.01M12 17h.01",
  headphones: "M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3z",
  earbuds: "M7 4a3 3 0 0 1 3 3v3a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM17 4a3 3 0 0 1 3 3v3a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM7 13v7M17 13v7",
  speaker: "M6 3h12v18H6zM12 8a2 2 0 1 0 0 .01M12 15a3 3 0 1 0 0 .01",
  music: "M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  play: "M7 4l13 8-13 8z",
  pause: "M7 4h4v16H7zM13 4h4v16h-4z",
  shuffle: "M3 7h4l10 10h4M17 5l4 2-4 2M3 17h4l3-3M14 7h3M17 15l4 2-4 2",
  note: "M6 3h12v18H6zM9 8h6M9 12h6M9 16h4",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  chat: "M4 5h16v11h-8l-4 4v-4H4z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  at: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM16 12v1a2 2 0 0 0 4 0v-1a8 8 0 1 0-3 6.2",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  star: "M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9L6.5 20l1-6.1L3 9.5l6.3-.9z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  pin: "M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  calendar: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M8 13h2M14 13h2M8 17h2",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  search: "M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM14.5 14.5L20 20",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8h.01M12 11v5",
  volume: "M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11",
  mute: "M4 9h4l5-4v14l-5-4H4zM16 9l5 6M21 9l-5 6",
  close: "M6 6l12 12M18 6L6 18",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  cloud: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4 4 0 0 1 0 9z",
  rocket: "M12 3c3 2 5 6 5 10l-2 2h-6l-2-2c0-4 2-8 5-10zM12 10a1.5 1.5 0 1 0 0 3M9 13l-3 3 2 1 1 3 3-3M15 13l3 3-2 1-1 3-3-3",
  video: "M3 7h13v10H3zM16 10l5-2v8l-5-2",
  blog: "M5 4h14v16H5zM8 8h8M8 11h8M8 14h5",
  ghost: "M12 3a7 7 0 0 0-7 7v11l2.5-2 2.5 2 2-2 2 2 2.5-2 2.5 2V10a7 7 0 0 0-7-7zM9.5 10h.01M14.5 10h.01",
  bird: "M4 12c4 0 6-3 7-6 1 2 3 3 6 3l4-1-3 3c0 5-4 8-9 8H5l3-2H4l3-2c-2-1-3-2-3-3z",
  reel: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 6a1.5 1.5 0 1 0 0 .01M12 18a1.5 1.5 0 1 0 0 .01M6 12a1.5 1.5 0 1 0 0 .01M18 12a1.5 1.5 0 1 0 0 .01M12 10.5a1.5 1.5 0 1 0 0 3M13 21h8",
  stream: "M3 5h18v12H3zM9 8.5v5l5-2.5zM8 21h8",
  headset: "M3 10h18v7H3zM3 12h4l2 2 6 0 2-2h4M8 8c2-2 6-2 8 0",
  watch: "M8 7h8v10H8zM9 7l1-4h4l1 4M9 17l1 4h4l1-4M12 10v2l1.5 1",
  ai: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM5 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM18 15l.8 1.7 1.7.8-1.7.8L18 20l-.8-1.7-1.7-.8 1.7-.8z",
  wifi: "M2 9c6-5 14-5 20 0M5 12.5c4-3.5 10-3.5 14 0M8.5 16c2-1.7 5-1.7 7 0M12 19.5h.01",
  battery: "M3 8h15v8H3zM18 10h3v4h-3zM6 11h5v2H6z",
  bin: "M5 7h14l-1 13H6zM3 7h18M9 7V4h6v3M10 11v6M14 11v6",
  window: "M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01",
  cursor: "M6 4l12 8-5 1 3 5-2 1-3-5-4 4z",
  keyboard: "M3 7h18v10H3zM6 10h1M9 10h1M12 10h1M15 10h1M18 10h.01M6 13h1M9 13h1M12 13h1M15 13h1M18 13h.01M8 16h8",
  mouse: "M8 3h8a3 3 0 0 1 3 3v9a7 7 0 0 1-14 0V6a3 3 0 0 1 3-3zM12 3v7M5 10h14",
  printer: "M6 9V3h12v6M6 9H4v8h2M18 9h2v8h-2M6 14h12v7H6z",
  book: "M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z",
  backpack: "M7 8h10a2 2 0 0 1 2 2v10H5V10a2 2 0 0 1 2-2zM9 8V5a3 3 0 0 1 6 0v3M8 14h8v6",
  ball: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c-5 4-5 14 0 18M12 3c5 4 5 14 0 18",
  trophy: "M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3M12 14v4M8 20h8",
  ticket: "M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM10 8v12",
  car: "M5 12l2-5h10l2 5M4 12h16v5H4zM7 17v2M17 17v2M7 14h.01M17 14h.01",
  plane: "M3 13l18-9-6 17-3-7z",
  house: "M4 11l8-7 8 7v9H4zM10 20v-6h4v6",
  cake: "M5 12h14v8H5zM5 16c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 2 1M12 4v4M8 8h8v4H8zM12 3a1 1 0 1 0 0 .01",
  gift: "M4 10h16v10H4zM4 7h16v3H4zM12 7v13M12 7c-3 0-4-1-4-2.5S10 3 12 7c2-4 4-2 4-.5S15 7 12 7z",
  toy: "M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM16 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 13v7M9 20h6",
  lego: "M4 9h16v10H4zM7 6h3v3H7zM14 6h3v3h-3z",
  skateboard: "M3 12c2 4 16 4 18 0M7 16v2M17 16v2",
  bike: "M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 18l4-8h6l2 8M10 10l3 8M13 6h3",
  pizza: "M12 3l9 16H3zM12 10a1 1 0 1 0 0 .01M9 15a1 1 0 1 0 0 .01M15 15a1 1 0 1 0 0 .01",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
  moon: "M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z",
  snow: "M12 3v18M3 12h18M6 6l12 12M18 6L6 18M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2",
  leaf: "M5 19c0-8 5-13 14-14 0 9-5 14-14 14zM5 19l8-8",
  flag: "M5 21V4M5 4h13l-3 4 3 4H5",
  map: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14",
  key: "M8 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM11 13l9-9M16 8l2 2M18 6l2 2",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4M12 15v3",
  bug: "M12 6a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0v-5a4 4 0 0 1 4-4zM9 4l1 2M15 4l-1 2M4 10h4M16 10h4M4 18l4-2M20 18l-4-2M12 10v9",
  smile: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 10h.01M15 10h.01M8.5 14.5c2 2 5 2 7 0",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  title?: string;
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  const d = P[name] ?? P.star;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}

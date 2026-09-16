import { Icon } from "@/components/ui/Icon";
import type { IconName, Placeholder as PlaceholderT } from "@/lib/content/schema";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const kindIcon: Record<PlaceholderT["kind"], IconName> = {
  text: "note",
  memory: "folder",
  photo: "camera",
  video: "video",
  track: "music",
  milestone: "flag",
  location: "pin",
  item: "star",
};

interface Props {
  placeholder: PlaceholderT;
  year: number;
  /** compact: a one-line chip; card: a dashed block with the hint; frame: a photo-shaped slot */
  variant?: "compact" | "card" | "frame";
  className?: string;
  aspect?: string;
}

/**
 * The only place placeholder styling lives. Shows the hint, the kind, and an EDIT badge naming
 * the exact file to change. Hidden entirely when profile.showPlaceholders is false.
 */
export function Placeholder({ placeholder, year, variant = "card", className, aspect }: Props) {
  if (!profile.showPlaceholders) return null;
  const file = `content/personal/${year}.ts`;
  const icon = kindIcon[placeholder.kind];

  if (variant === "compact") {
    return (
      <span
        className={cn("placeholder-slot inline-flex items-center gap-2 px-2.5 py-1 text-[12px]", className)}
        title={`${placeholder.hint} — edit ${file}`}
      >
        <Icon name={icon} size={12} />
        <span className="opacity-80">{placeholder.hint}</span>
        <span className="placeholder-badge">edit</span>
      </span>
    );
  }

  if (variant === "frame") {
    return (
      <div
        className={cn("placeholder-slot flex flex-col items-center justify-center gap-2 p-4 text-center", className)}
        style={{ aspectRatio: aspect ?? "4 / 3" }}
        title={`Edit ${file}`}
      >
        <Icon name={icon} size={28} className="opacity-60" />
        <p className="m-0 max-w-[26ch] text-[12px] leading-snug opacity-80">{placeholder.hint}</p>
        <span className="placeholder-badge">edit {file.replace("content/personal/", "")}</span>
      </div>
    );
  }

  return (
    <div className={cn("placeholder-slot flex gap-3 p-4", className)} title={`Edit ${file}`}>
      <Icon name={icon} size={18} className="mt-0.5 shrink-0 opacity-60" />
      <div className="min-w-0">
        <p className="m-0 text-[13px] leading-snug opacity-85">{placeholder.hint}</p>
        <p className="label-mono m-0 mt-2 flex flex-wrap items-center gap-2">
          <span className="placeholder-badge">edit</span>
          <span className="normal-case tracking-normal opacity-70">{file}</span>
        </p>
      </div>
    </div>
  );
}

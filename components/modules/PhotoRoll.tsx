"use client";

import { Surface } from "@/components/year/Surface";
import { CameraRoll, Album, Grid, Feed, Cinematic } from "@/components/gallery/styles";
import { EmptyState, GroupLabel } from "./ItemChip";
import { Placeholder } from "./Placeholder";
import { VideoTile } from "@/components/gallery/VideoTile";
import { isPlaceholder } from "@/lib/content/placeholders";
import type { EraId, GalleryStyle, Photo, Video, YearData } from "@/lib/content/schema";
import { profile } from "@/content/profile";

const styleForEra: Record<EraId, GalleryStyle> = {
  xp: "camera-roll", aero: "album", flat: "grid", dark: "feed", glass: "cinematic",
};
const titleForStyle: Record<GalleryStyle, string> = {
  "camera-roll": "Camera Roll", album: "Photo Album", grid: "Photos", feed: "Feed", cinematic: "Photographs",
};

export function PhotoRoll({ data }: { data: YearData }) {
  const style = styleForEra[data.era];
  const entries = profile.showPlaceholders ? data.personal.photos : data.personal.photos.filter((p) => !isPlaceholder(p));
  const photos = data.personal.photos.filter((p) => !isPlaceholder(p)) as Photo[];
  const Comp = { "camera-roll": CameraRoll, album: Album, grid: Grid, feed: Feed, cinematic: Cinematic }[style];
  const videos = data.personal.videos.filter((v) => !isPlaceholder(v)) as Video[];
  const videoSlots = profile.showPlaceholders ? data.personal.videos.filter(isPlaceholder) : [];
  const count = [photos.length ? `${photos.length} photos` : "", videos.length ? `${videos.length} videos` : ""].filter(Boolean).join(" · ");

  return (
    <Surface id="photos" title={titleForStyle[style]} icon="camera" aside={count || "from the camera roll"}>
      {entries.length ? <Comp entries={entries} photos={photos} year={data.year} /> : <EmptyState>No photos yet. Drop files in public/photos/{data.year}/ and run npm run photos.</EmptyState>}
      {videos.length || videoSlots.length ? (
        <>
          <GroupLabel className="mt-5">Video</GroupLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((v) => <VideoTile key={v.id} video={v} year={data.year} />)}
            {videoSlots.map((v, i) => <Placeholder key={v.id ?? i} placeholder={v} year={data.year} variant="frame" aspect="16 / 9" />)}
          </div>
        </>
      ) : null}
    </Surface>
  );
}

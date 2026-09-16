/**
 * YouTube IFrame API adapter. Loaded only after a user plays a YouTube-sourced track.
 * The player must stay visible (it lives in the PlayerBar), per YouTube's terms.
 */
declare global {
  interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void }
}
interface YTPlayer {
  playVideo(): void; pauseVideo(): void; seekTo(s: number, allow: boolean): void; setVolume(v: number): void; mute(): void; unMute(): void;
  getCurrentTime(): number; getDuration(): number; getPlayerState(): number; destroy(): void; loadVideoById(id: string): void;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: { videoId: string; width?: number; height?: number; playerVars?: Record<string, number | string>; events?: { onReady?: () => void; onStateChange?: (e: { data: number }) => void } }) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
}

let api: Promise<YTNamespace> | null = null;

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (api) return api;
  api = new Promise((resolve) => {
    if (window.YT?.Player) { resolve(window.YT); return; }
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return api;
}

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export interface YtController {
  play(): void; pause(): void; seek(s: number): void; volume(v: number): void; mute(m: boolean): void;
  time(): number; duration(): number; playing(): boolean; load(id: string): void; destroy(): void;
}

export async function createYouTubePlayer(el: HTMLElement, videoId: string, onState: (state: "playing" | "paused" | "ended" | "loading") => void): Promise<YtController> {
  const YT = await loadYouTubeApi();
  return new Promise((resolve) => {
    const p = new YT.Player(el, {
      videoId, width: 160, height: 90,
      playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 0 },
      events: {
        onReady: () => resolve({
          play: () => p.playVideo(), pause: () => p.pauseVideo(), seek: (s) => p.seekTo(s, true), volume: (v) => p.setVolume(Math.round(v * 100)),
          mute: (m) => (m ? p.mute() : p.unMute()), time: () => p.getCurrentTime(), duration: () => p.getDuration(),
          playing: () => p.getPlayerState() === YT.PlayerState.PLAYING, load: (id) => p.loadVideoById(id), destroy: () => p.destroy(),
        }),
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) onState("playing");
          else if (e.data === YT.PlayerState.PAUSED) onState("paused");
          else if (e.data === YT.PlayerState.ENDED) onState("ended");
          else if (e.data === YT.PlayerState.BUFFERING) onState("loading");
        },
      },
    });
  });
}

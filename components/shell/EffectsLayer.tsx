/** Scanlines, grain, vignette, and phosphor glow. Pure CSS overlays; intensities come from era tokens. */
export function EffectsLayer() {
  return (
    <div aria-hidden="true">
      <div className="fx-layer fx-glow" />
      <div className="fx-layer fx-scanlines" />
      <div className="fx-layer fx-grain" />
      <div className="fx-layer fx-vignette" />
    </div>
  );
}

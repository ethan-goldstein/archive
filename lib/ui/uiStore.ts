/** Global UI switches shared between chrome and overlays (palette, player drawer, toasts). */
export interface Toast { id: number; title: string; body?: string; icon?: string }
export interface DialogButton { label: string; onClick?: () => void; default?: boolean }
export interface Dialog { title: string; message: string; detail?: string; icon?: string; buttons: DialogButton[] }
export interface UiState {
  paletteOpen: boolean;
  playerOpen: boolean;
  menuSheetOpen: boolean;
  maximized: boolean;
  status: string;
  busy: boolean;
  dialog: Dialog | null;
  toasts: Toast[];
}

const serverState: UiState = { paletteOpen: false, playerOpen: false, menuSheetOpen: false, maximized: false, status: "Done", busy: false, dialog: null, toasts: [] };
let statusTimer: ReturnType<typeof setTimeout> | null = null;
let state: UiState = serverState;
const listeners = new Set<() => void>();
let toastId = 0;

function emit() {
  listeners.forEach((l) => l());
}

export const uiStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => state,
  getServer: () => serverState,
  openPalette() { state = { ...state, paletteOpen: true }; emit(); },
  closePalette() { state = { ...state, paletteOpen: false }; emit(); },
  togglePalette() { state = { ...state, paletteOpen: !state.paletteOpen }; emit(); },
  openPlayer() { state = { ...state, playerOpen: true }; emit(); },
  closePlayer() { state = { ...state, playerOpen: false }; emit(); },
  togglePlayer() { state = { ...state, playerOpen: !state.playerOpen }; emit(); },
  openMenuSheet() { state = { ...state, menuSheetOpen: true }; emit(); },
  closeMenuSheet() { state = { ...state, menuSheetOpen: false }; emit(); },
  toggleMaximized() { state = { ...state, maximized: !state.maximized }; emit(); },
  /** Status bar text. `busy` runs the progress blocks; it auto-clears to "Done" after `ms`. */
  setStatus(text: string, busy = false, ms = 500) {
    if (statusTimer) clearTimeout(statusTimer);
    state = { ...state, status: text, busy };
    emit();
    if (busy) statusTimer = setTimeout(() => { state = { ...state, status: "Done", busy: false }; emit(); }, ms);
  },
  openDialog(dialog: Dialog) { state = { ...state, dialog }; emit(); },
  closeDialog() { state = { ...state, dialog: null }; emit(); },
  toast(title: string, body?: string, icon?: string) {
    const id = ++toastId;
    state = { ...state, toasts: [...state.toasts, { id, title, body, icon }] };
    emit();
    setTimeout(() => uiStore.dismiss(id), 4200);
    return id;
  },
  dismiss(id: number) {
    state = { ...state, toasts: state.toasts.filter((t) => t.id !== id) };
    emit();
  },
};

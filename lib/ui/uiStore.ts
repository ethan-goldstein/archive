/** Global UI switches shared between chrome and overlays (palette, player drawer, toasts). */
export interface Toast { id: number; title: string; body?: string; icon?: string }
export interface DialogButton { label: string; onClick?: () => void; default?: boolean }
export interface Dialog { title: string; message: string; detail?: string; icon?: string; buttons: DialogButton[] }
export interface UiState {
  paletteOpen: boolean;
  playerOpen: boolean;
  dialog: Dialog | null;
  toasts: Toast[];
}

const serverState: UiState = { paletteOpen: false, playerOpen: false, dialog: null, toasts: [] };
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

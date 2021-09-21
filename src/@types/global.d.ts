declare global {
  interface Window {
    electron: Sandbox;
  }
}

export interface Sandbox {
  open: () => Promise<void | string[]>;
  save: (data: any) => Promise<void | string[]>;
}
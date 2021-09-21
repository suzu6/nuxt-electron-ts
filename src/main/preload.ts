import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld(
  'electron', {
    open: async (): Promise<number[]> => ipcRenderer.invoke('open', 'open-success'),
    save: async (data: any): Promise<number[]> => ipcRenderer.invoke('save', data)
  }
);
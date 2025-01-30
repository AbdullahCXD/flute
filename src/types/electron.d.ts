interface IpcRenderer {
  send(channel: string, ...args: any[]): void;
  on(channel: string, listener: (event: any, ...args: any[]) => void): void;
  once(channel: string, listener: (event: any, ...args: any[]) => void): void;
  removeListener(channel: string, listener: (...args: any[]) => void): void;
}

interface ElectronAPI {
  ipcRenderer: IpcRenderer;
  isMaximized(): Promise<boolean>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
} 
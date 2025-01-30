import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => {
        // whitelist channels
        const validChannels = ['window-minimize', 'window-maximize', 'window-close']
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, ...args)
        }
      },
      on: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ['window-maximized', 'window-unmaximized']
        if (validChannels.includes(channel)) {
          // Strip event as it includes `sender` and is a security risk
          ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
      },
      once: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ['window-maximized', 'window-unmaximized']
        if (validChannels.includes(channel)) {
          ipcRenderer.once(channel, (event, ...args) => func(...args))
        }
      },
      removeListener: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ['window-maximized', 'window-unmaximized']
        if (validChannels.includes(channel)) {
          ipcRenderer.removeListener(channel, func)
        }
      }
    },
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
  }
)

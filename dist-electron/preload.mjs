"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld(
  "electron",
  {
    ipcRenderer: {
      send: (channel, ...args) => {
        const validChannels = ["window-minimize", "window-maximize", "window-close"];
        if (validChannels.includes(channel)) {
          electron.ipcRenderer.send(channel, ...args);
        }
      },
      on: (channel, func) => {
        const validChannels = ["window-maximized", "window-unmaximized"];
        if (validChannels.includes(channel)) {
          electron.ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
      },
      once: (channel, func) => {
        const validChannels = ["window-maximized", "window-unmaximized"];
        if (validChannels.includes(channel)) {
          electron.ipcRenderer.once(channel, (event, ...args) => func(...args));
        }
      },
      removeListener: (channel, func) => {
        const validChannels = ["window-maximized", "window-unmaximized"];
        if (validChannels.includes(channel)) {
          electron.ipcRenderer.removeListener(channel, func);
        }
      }
    },
    isMaximized: () => electron.ipcRenderer.invoke("window-is-maximized")
  }
);

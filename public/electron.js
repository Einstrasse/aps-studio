const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const Menu = electron.Menu;
const isDev = require("electron-is-dev");
const isMac = process.platform === 'darwin'
let mainWindow;
let menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Open File"
            },
            {
                label: "Save"
            },
            {
                role: isMac ? "close" : "quit"
            }
        ]
    },
    // {
    //     label: "Templates",
    //     submenu: [
    //         label
    //     ]
    // },
    {
        label: "Test",
        submenu: [
            {
                label: "Tempalte code 1",
                click: async() => {
                    mainWindow.webContents.executeJavaScript('window.CodeEditor.updateCode("Template code 1");');
                }
            }
        ]
    },
    {
        role: "help",
        submenu: [
            {
                label: "About",
                click: async() => {
                    await electron.shell.openExternal("https://github.com/Einstrasse/aps-studio")
                }
            }
        ]
    }
  ]
Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));


function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 680 });
    mainWindow.loadURL(
    isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`
    );
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
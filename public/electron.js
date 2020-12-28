const electron = require("electron");
const fs = require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const Menu = electron.Menu;
const isDev = require("electron-is-dev");
const { MenuItem } = require("electron");
const isMac = process.platform === 'darwin'
let mainWindow;
/*
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
*/
(function setMenu() {
    const menu = new Menu()
    menu.append(new MenuItem({ 
        id: '1',
        label: 'File', 
        submenu: [
            {
                role: isMac ? "close" : "quit"
            }
        ]
    }))
    let templates = []
    let files = fs.readdirSync(path.join(__dirname, "templates"));
    files.forEach(file_name => {
        let file_data = fs.readFileSync(path.join(__dirname, "templates", file_name));
        let encoded = Buffer.from(file_data).toString('base64');
        let jscode = 'window.CodeEditor.updateCode(atob("' + encoded + '"));';
        // console.log(file_data)
        // console.log(encoded)
        // console.log(jscode)
        templates.push({
            label: file_name,
            click: () => {
                mainWindow.webContents.executeJavaScript(jscode);
            }
        })
    })
    console.log(templates);
    menu.append(new MenuItem({
        id: '2',
        label: "Templates",
        submenu: templates
    }))
    menu.append(new MenuItem({ 
        id: '3',
        role: "help",
        submenu: [
            {
                label: "About",
                click: async() => {
                    await electron.shell.openExternal("https://github.com/Einstrasse/aps-studio")
                }
            }
        ]
    }))
    
    Menu.setApplicationMenu(menu);
})();

function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 800 });
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
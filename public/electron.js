const electron = require("electron");
const fs = require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const Menu = electron.Menu;
const isDev = require("electron-is-dev");
const { MenuItem } = require("electron");
const os = require('os');
const { exec, execFile } = require('child_process');
const isMac = process.platform === 'darwin'
let mainWindow;
function execJsCode(jscode) {
    let ret;
    try {
        ret = mainWindow.webContents.executeJavaScript(jscode).then((d) => {return d});
    } catch(e) {
        console.log('execJsCode', e);
        throw e;
    }
    return ret;
}
function writeText(varname, data) {
    let encoded = Buffer.from(data).toString('base64');
    let jscode = `window.${varname}.updateCode(atob("${encoded}"));`;
    //mainWindow.webContents.executeJavaScript(jscode);
    execJsCode(jscode);
}
async function readText(varname) {
    //returns promise object
    let jscode = `window.${varname}.getCode()`
    let ret = await execJsCode(jscode);
    return ret;
    // return await mainWindow.webContents.executeJavaScript(jscode);
}
function buildAndRun(code, input) {
    const code_file = path.join(os.tmpdir(), "code.cpp")
    const out_file = path.join(os.tmpdir(), "code.out")
    const input_file = path.join(os.tmpdir(), "input.txt")
    fs.writeFileSync(code_file, code);
    fs.writeFileSync(input_file, input);
    console.log(process.platform)
    console.log(code_file)
    exec(`g++ ${code_file} -o ${out_file} -std=c++11 -Wall`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            writeText('LogView', stderr);
            return;
        }
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        writeText('LogView', [stdout, stderr].join('\n'));
        execFile(out_file, ` < ${input_file}`.split(' '), (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                writeText('LogView', stderr);
                return;
            }
            console.log('stdout', stdout);
            console.log('stderr', stderr);
            writeText('LogView', [stdout, stderr].join('\n'));
        })
        
    });

}


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
        templates.push({
            label: file_name,
            click: () => {
                writeText('CodeEditor', file_data);
            }
        })
    })
    menu.append(new MenuItem({
        id: '2',
        label: "Templates",
        submenu: templates
    }))
    menu.append(new MenuItem({
        id: '3',
        label: "Build",
        submenu: [
            {
                label: "Run with Input (Ctrl + F5)",
                accelerator: "Ctrl+F5",
                click: async() => {
                    console.log("Run with Input!");
                    var code = await readText("CodeEditor");
                    var input = await readText("InputEditor");
                    buildAndRun(code, input);
                }
            }
        ]
    }))
    menu.append(new MenuItem({ 
        id: '4',
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

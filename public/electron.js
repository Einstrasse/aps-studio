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
const { traceProcessWarnings } = require("process");
const isMac = process.platform === 'darwin'
const async = require('async');
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
function setTestCaseNum(num) {
    let jscode = `window.App.setNumInputs(${num})`;
    execJsCode(jscode);
}
function writeText(varname, data) {
    let encoded = Buffer.from(data).toString('base64');
    let jscode = `window.${varname}.updateCode(atob("${encoded}"));`;
    execJsCode(jscode);
}
function appendText(varname, data) {
    let encoded = Buffer.from(data).toString('base64');
    let jscode = `window.${varname}.appendCode(atob("${encoded}"));`;
    execJsCode(jscode);
}
async function readText(varname) {
    let jscode = `window.${varname}.getCode()`
    let ret = await execJsCode(jscode);
    return ret;
}
async function getInputNames() {
    let jscode = `window.App.getInputNames()`
    let ret = await execJsCode(jscode);
    return ret;
}
function buildAndRun(code, inputs) {
    const code_file = path.join(os.tmpdir(), "code.cpp")
    const exe_file = path.join(os.tmpdir(), "code.out")
    
    fs.writeFileSync(code_file, code);
    console.log(process.platform) // 'linux'
    exec(`g++ ${code_file} -o ${exe_file} -std=c++11 -Wall`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            appendText('LogView', stderr);
            return;
        }
        async.mapLimit(inputs, 1, (item, callback) => {
            let fname = item.fname;
            let tc = item.tc;
            const input_file = path.join(os.tmpdir(), fname)
            fs.writeFileSync(input_file, tc);
            console.log('compilation stdout', stdout);
            console.log('compilation stderr', stderr);
            appendText('LogView', [stderr, stdout, `---- Test Case : ${fname} ----`].filter(Boolean).join('\n'));
            exec(`${exe_file} < ${input_file}`, {
                timeout: 5
            }, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    appendText('LogView', stderr);
                    console.log("2.5", stderr);
                    return;
                }
                console.log('exec stdout', stdout);
                console.log('exec stderr', stderr);
                appendText('LogView', [stderr, stdout].filter(Boolean).join('\n'));
                callback(null);
            })
        }, (err, res) => {
            appendText('LogView', '------- All Test cases ended -------\n');
        });
        
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
        let short_cut = `Ctrl+${templates.length + 1}`;
        templates.push({
            label: file_name,
            accelerator: short_cut,
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
    let setTC = [];
    for (let i=1; i <=5; i++) {
        setTC.push({
            label: `${i} ${i > 1 ? 'Cases' : 'Case'}`,
            accelerator: `Alt+${i}`,
            click: () => {
                setTestCaseNum(i);
            }
        })
    }
    menu.append(new MenuItem({
        id: '3',
        label: "Testcases",
        submenu: setTC
    }))
    menu.append(new MenuItem({
        id: '4',
        label: "Build",
        submenu: [
            {
                label: "Run with Input (Ctrl + F5)",
                accelerator: "Ctrl+F5",
                click: async() => {
                    console.log("Run with Input!");
                    let code = await readText("CodeEditor");
                    let var_names = await getInputNames();
                    let inputs = [];
                    var_names.map(async(item, index) => {
                        let fname = `Input_${item}`;
                        let tc = await readText(fname);
                        inputs.push({
                            fname: fname,
                            tc: tc
                        })
                    })
                    // var input = await readText("InputEditor");
                    buildAndRun(code, inputs);
                }
            }
        ]
    }))
    menu.append(new MenuItem({ 
        id: '5',
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

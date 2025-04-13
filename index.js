const { app, BrowserWindow, ipcMain } = require('electron');
const sound = require("sound-play");
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        height: 700,
        width: 1270,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        },
        autoHideMenuBar: true,
        title: 'Ipodie',
        minHeight:700,
        minWidth:1270,
        backgroundColor:'#202020'
    });

    win.setTitle('Ipodie');
    win.loadFile(path.join(__dirname, 'app', 'load.html'));
}

function splashWindow() {
    const win = new BrowserWindow({
        height: 800,
        width: 800,
        webPrefepences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        title: 'Ipodie - Loading',
        alwaysOnTop:true,
        frame:false,
        resizable:false,
        fullscreenable:false,
        transparent:true,
        skipTaskbar:true
    });

    win.setTitle('Ipodie - Loading');
    win.loadFile('app/splash.html');

    sound.play(path.join(__dirname, "img", "startup.wav"))

    setTimeout(() => {
        createWindow()
        win.close()
    }, 6000);
}

app.whenReady().then(splashWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const sound = require("sound-play");
const path = require('path')

const usb = require('./manager/usb')

var win;

function createWindow() {
    win = new BrowserWindow({
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
        resizable:false,
        backgroundColor:'#202020'
    });

    win.setTitle('Ipodie');
    win.loadFile(path.join(__dirname, 'app', 'load.html'));

    setInterval(() => {
        if(win === null){
            return
        }

        const connection = usb.detect()
        if(!connection.connected){
            if(win.webContents.getURL().includes('load.html') || win.webContents.getURL().includes('disconnected.html')) return;

            win.loadFile(path.join(__dirname, 'app', 'disconnected.html'));
        }
    }, 5000);

    ipcMain.on('close-window', () => {
        win.close()
    });

    win.on('closed', () => {
        win = null;
    });
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

const usb_package = require('usb')    
usb_package.on('attach', function(device) { 
    setTimeout(() => {
        const connection = usb.detect()

        if(connection.connected && win === null){
            splashWindow()
        }
    }, 4000);
});

app.whenReady().then(splashWindow);

app.on('window-all-closed', (event) => {
    event.preventDefault();
  });

let tray = null
app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'img', 'icon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {
        label: 'New session',
        click: () => { splashWindow() }
    },
    {
        label: 'Quit Ipodie',
        click: () => { app.quit() }
    },
  ])
  tray.setToolTip('Ipodie')
  tray.setContextMenu(contextMenu)
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        height: 700,
        width: 1270,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        autoHideMenuBar: true,
        title: 'Ipodie',
        minHeight:700,
        minWidth:1270
    });

    win.setTitle('Ipodie');
    win.loadFile('app/load.html');
}

function splashWindow() {
    const win = new BrowserWindow({
        height: 400,
        width: 400,
        webPrefepences: {
            nodeIntegration: true,
            enableRemoteModule: true
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

    setTimeout(() => {
        createWindow()
        win.close()
    }, 5000);
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
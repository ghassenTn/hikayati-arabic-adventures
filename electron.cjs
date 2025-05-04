const path = require('path');
const { app, BrowserWindow } = require('electron');
const url = require('url');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // Correct way to load the index.html in Electron
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open DevTools for debugging
  win.webContents.openDevTools();
  console.log('Loading: ', path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

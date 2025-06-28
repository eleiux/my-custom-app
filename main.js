const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    fullscreen: true,
    minWidth: 400,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('show-alert', (event, message) => {
  dialog.showMessageBox({
    type: 'info',
    message: message,
    buttons: ['OK']
  });
});

ipcMain.on('run-command', (event, command) => {
  exec('gnome-terminal -- bash -c "' + command + '; exec bash"', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
});

ipcMain.on('set-shape', (event, shape) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setShape(shape);
});

process.on('SIGINT', () => {
  app.quit();
});

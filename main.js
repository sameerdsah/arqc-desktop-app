const { app, BrowserWindow, Menu } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let backendProcess;
let mainWindow;

function getBackendPath() {
  const exeName = process.platform === 'win32' ? 'main.exe' : 'main';
  return app.isPackaged
    ? path.join(process.resourcesPath, 'backend', exeName)
    : path.join(__dirname, 'backend', exeName);
}

function startBackend() {
  backendProcess = spawn(getBackendPath(), [], { stdio: 'inherit' });
}

function waitForServer(url, callback, retries = 30) {
  http.get(url, () => {
    callback();
  }).on('error', () => {
    if (retries === 0) {
      console.error('Backend did not start in time.');
      return;
    }
    setTimeout(() => waitForServer(url, callback, retries - 1), 500);
  });
}

function createWindow() {
  Menu.setApplicationMenu(null); // removes File/Edit/View/Window bar, like Calculator

  mainWindow = new BrowserWindow({
    width: 480,
    height: 720,
    minWidth: 400,
    minHeight: 600,
    title: 'ARQC Generator',
    icon: path.join(__dirname, 'assets', 'OPUS_logo.ico'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true }
  });

  waitForServer('http://127.0.0.1:5000', () => {
    mainWindow.loadURL('http://127.0.0.1:5000');
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
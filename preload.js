const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showAlert: (message) => ipcRenderer.send('show-alert', message),
  runCommand: (command) => ipcRenderer.send('run-command', command)
});

window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-btn');
  closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

  const elements = [document.querySelector('h1'), document.querySelector('p'), document.getElementById('close-btn'), document.getElementById('bottom-box')];
  const shape = [];
  elements.forEach(element => {
    if (element) {
      const { x, y, width, height } = element.getBoundingClientRect();
      shape.push({ x, y, width, height });
    }
  });
  ipcRenderer.send('set-shape', shape);
});

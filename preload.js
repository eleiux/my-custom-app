const { ipcRenderer } = require('electron');

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

  const elements = [document.querySelector('h1'), document.querySelector('p'), document.getElementById('close-btn')];
  const shape = [];
  elements.forEach(element => {
    const { x, y, width, height } = element.getBoundingClientRect();
    shape.push({ x, y, width, height });
  });
  ipcRenderer.send('set-shape', shape);
});

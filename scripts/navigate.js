const { ipcRenderer } = require('electron');

function page(name){
    alert(name)
    ipcRenderer.send('navigate', `${name}.html`);
}
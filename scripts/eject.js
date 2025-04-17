async function eject_device(){
    const { exec } = require('child_process');

    document.body.style.cursor = "wait";
    document.body.innerHTML = `<div class="center-screen"><div class="lds-hourglass"></div></div>`

    exec(`powershell "(New-Object -comObject Shell.Application).NameSpace(17).ParseName('${sessionStorage.getItem('ipod_path')}').InvokeVerb(\'Eject\')"`, (error, stdout, stderr) => {
      if (error) {
        alert(error)
        window.location.href = ('./load_home.html')
        return;
      }
    });
}

function end(){
    const { ipcRenderer } = require('electron');

    ipcRenderer.send('close-window');
}
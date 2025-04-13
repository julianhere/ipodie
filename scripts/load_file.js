
    const usb = require('../manager/usb')
    var usb_package = require('usb');
    const wait = require('node:timers/promises').setTimeout;
    
    // usb_package.on('attach', function(device) { 
    //     detect_connected()
    // });

    async function detect_connected(){
        document.getElementById('loading_screen').classList.remove('hidden')
        document.getElementById('not_connected').classList.add('hidden')

        await wait(1000)

        status("Detecting")

        await wait(1000)

        var connection = usb.detect()
        if(connection.connected === false){
            document.getElementById('loading_screen').classList.add('hidden')
            document.getElementById('not_connected').classList.remove('hidden')
            return 
        }

        var name = await usb.ipod_name()
        status(`Loading ${name}`)

        sessionStorage.setItem("ipod_path", connection.path)
        sessionStorage.setItem("ipod_name", name)

        await wait(1000)

        if(!localStorage.getItem(`model_${name}`)){
            window.location.href = ('./choose_model.html')
        } else {
            window.location.href = ('./home.html')
        }
    }

    function status(text){
        document.getElementById("status").innerHTML = text
    }
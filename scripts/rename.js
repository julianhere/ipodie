async function rename(){
    hide_error()

    var new_name = document.getElementById('modal-rename-input').value

    if(!new_name) {
        return show_error('You must enter something')
    }

    new_name = new_name.toUpperCase()
    
    document.getElementById('modal-rename-content').classList.add('hidden')
    document.getElementById('modal-rename-loading').classList.remove('hidden')

    const usb = require('../manager/usb')
    var renaming = await usb.ipod_rename(new_name)

    if(renaming.renamed === true){
        window.location.reload()
        localStorage.setItem(`model_${new_name}`, localStorage.getItem(`model_${sessionStorage.getItem('ipod_name')}`))
        sessionStorage.setItem("ipod_name", new_name)
    } else {
        return show_error(renaming.error)
    }

    function show_error(text){
        document.getElementById('modal-rename-content').classList.remove('hidden')
        document.getElementById('modal-rename-loading').classList.add('hidden')
        document.getElementById('modal-rename-error').classList.remove('hidden')
        document.getElementById('modal-rename-error').innerHTML = text
    }

    function hide_error(text){
        document.getElementById('modal-rename-content').classList.remove('hidden')
        document.getElementById('modal-rename-loading').classList.add('hidden')    
        document.getElementById('modal-rename-error').classList.add('hidden')
    }
    
    setTimeout(() => {
        hide_error()
    }, 60000);
}
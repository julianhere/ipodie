function ipod_name_and_type(){
    var name = sessionStorage.getItem('ipod_name')
    var type = localStorage.getItem(`model_${name}`)
    
    document.getElementById('ipod_img').src = `../img/ipod_${type.toLowerCase()}.png`
    document.getElementById('ipod_name').innerHTML = name
    document.getElementById('ipod_type').innerHTML = type
}

async function ipod_capacity(){
    const usb = require('../manager/usb')

    var space = await usb.ipod_space()

    document.getElementById("storage_data").classList.remove("hidden")
    document.getElementById("storage_data_loading").classList.add("hidden")
    document.getElementById('capacity').innerHTML = `${space.total} GB`
    document.getElementById('space_left').innerHTML = `${space.free} GB`

    const totalGB = Number(space.total)
    const freeGB = Number(space.free)

    const usedGB = totalGB - freeGB;
    const percentUsed = (usedGB / totalGB) * 100;
  
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${percentUsed.toFixed(2)}%`;
}
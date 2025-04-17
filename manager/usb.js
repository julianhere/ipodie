const fs = require('fs');
const { exec } = require('child_process');
const wait = require('node:timers/promises').setTimeout;
const path = require('path');

const driveLetters = [
    'A:', 'B:', 'C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', 'K:', 'L:',
    'M:', 'N:', 'O:', 'P:', 'Q:', 'R:', 'S:', 'T:', 'U:', 'V:', 'W:', 'X:',
    'Y:', 'Z:'
];

function detect(){
    var ipod_path;
    var connected = false;
    for (const letter of driveLetters) {
      const ipodControlPath = `${letter}\\iPod_Control`;
      if (fs.existsSync(ipodControlPath)) {
        ipod_path = letter
        connected = true
      }
    }

    return {
        connected:connected,
        path:ipod_path
    }
}

async function ipod_name(){
  var connection = detect()
  if(!connection.connected) return {error:'iPod not connected.'}

  var ipod_name;

  exec(`wmic logicaldisk where "DeviceID='${connection.path}'" get VolumeName`, (err, stdout) => {
    if (err) {
      return {error:`Error getting iPod name: ${err}`}
    }

    ipod_name = stdout.split('\n')[1]
  });

  await wait(1000)
  return ipod_name
}

async function ipod_space(){
  var connection = detect()
  if(!connection.connected) return {error:'iPod not connected.'}

  var freeSpace;
  var totalSpace;

  exec(`wmic logicaldisk where "DeviceID='${connection.path}'" get FreeSpace,Size`, (err, stdout) => {
    if (err) {
      return console.error(`Error getting disk space: ${err}`);
    }
  
    // Clean up and parse output
    const lines = stdout.trim().split('\n');
    const dataLine = lines[1]?.trim().split(/\s+/);
  
    if (dataLine && dataLine.length === 2) {
      freeSpace = parseInt(dataLine[0], 10);
      totalSpace = parseInt(dataLine[1], 10);
  
      const toGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2)

      freeSpace = toGB(freeSpace)
      totalSpace = toGB(totalSpace)
    } else {
      console.error('Could not parse disk space info');
    }
  });

  await wait(1000)
  return {
    free:freeSpace,
    total:totalSpace
  }
}

async function ipod_rename(new_name){
  var connection = detect()
  if(!connection.connected) return {error:'iPod not connected.'}

  var response;

  exec(`wmic volume where "DriveLetter='${connection.path}'" set Label="${new_name}"`, (error, stdout, stderr) => {
    if (error) {
      if(error.message.includes('Description =')){
        error = error.message.split('Description = ')[1]
      }
      response = {error:error}
      return
    }
    if (stderr) {
      if(stderr.message.includes('Description =')){
        stderr = stderr.message.split('Description = ')[1]
      }
      response = {error:stderr.split('Description = ')[1]}
      return
    }
    
    response = {renamed:true, new_name:new_name, path:connection.path}
  });

  await wait(1000)
  return response
}

module.exports = { detect, ipod_name, ipod_space, ipod_rename }
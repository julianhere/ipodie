const fs = require('fs');
const { exec } = require('child_process');
const wait = require('node:timers/promises').setTimeout;

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

  await wait(500)
  return ipod_name
}

ipod_name().then(h => {console.log(h)})

module.exports = { detect, ipod_name }
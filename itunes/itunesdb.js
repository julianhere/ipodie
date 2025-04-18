const fs = require('fs');
const path = require('path');

/**
 * Reads the iTunesDB file and extracts basic track info.
 */
function readiTunesDB(filePath) {
    const data = fs.readFileSync(filePath);
    const tracks = [];
  
    function parseAtom(offset, depth = 0) {
      while (offset < data.length) {
        const atomType = data.toString('ascii', offset, offset + 4);
        const atomLength = data.readUInt32BE(offset + 4);
  
        if (!atomType.match(/mh../)) break; // Stop if invalid
  
        if (atomType === 'mhit') {
          const trackID = data.readUInt32BE(offset + 8);
          const title = readString(data, offset + 56, 64);
          const artist = readString(data, offset + 120, 64);
  
          tracks.push({
            trackID,
            title,
            artist,
          });
        }
  
        // Dive into children (if any)
        if (atomLength > 8) {
          parseAtom(offset + 8, depth + 1);
        }
  
        offset += atomLength;
      }
    }
  
    const header = data.toString('ascii', 0, 4);
    if (header !== 'mhbd') {
      throw new Error('Invalid iTunesDB file (missing mhbd header)');
    }
  
    parseAtom(0);
    return tracks;
  }
  

/**
 * Writes a basic iTunesDB file with dummy tracks.
 */
function writeiTunesDB(filePath, tracks) {
  const buffers = [];

  // Add header (mhbd)
  const header = Buffer.alloc(8);
  header.write('mhbd', 0, 'ascii');
  header.writeUInt32BE(8, 4);
  buffers.push(header);

  // Write each track as an 'mhit' record
  for (const track of tracks) {
    const buf = Buffer.alloc(256);
    buf.write('mhit', 0, 'ascii');
    buf.writeUInt32BE(256, 4);
    buf.writeUInt32BE(track.trackID || 1, 8);
    writeString(buf, 56, track.title || 'Untitled', 64);
    writeString(buf, 120, track.artist || 'Unknown', 64);
    buffers.push(buf);
  }

  const out = Buffer.concat(buffers);
  fs.writeFileSync(filePath, out);
}

/**
 * Reads a null-terminated string from buffer.
 */
function readString(buf, offset, length) {
  const slice = buf.slice(offset, offset + length);
  const str = slice.toString('utf8').replace(/\0.*$/, '');
  return str.trim();
}

/**
 * Writes a string into buffer at offset, padded with nulls.
 */
function writeString(buf, offset, str, maxLen) {
  const padded = Buffer.alloc(maxLen);
  const encoded = Buffer.from(str, 'utf8');
  encoded.copy(padded);
  padded.copy(buf, offset);
}

module.exports = {
  readiTunesDB,
  writeiTunesDB,
};

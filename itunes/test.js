const path = require('path');
const { readiTunesDB, writeiTunesDB } = require('./itunesdb');

const tracks = readiTunesDB('./itunes/example/iTunesDB');
console.log('Tracks found:', tracks);

// tracks.push({
//   trackID: Date.now(),
//   title: 'Test Song',
//   artist: 'GPT Band',
// });

// writeiTunesDB('example/iTunesDB_NEW', tracks);
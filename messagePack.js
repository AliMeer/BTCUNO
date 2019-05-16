var msgpack = require("msgpack");
var QRCode = require('qrcode')

// encode from JS Object to MessagePack (Buffer)
var buffer = msgpack.pack({"foo": "bar"});

// decode from MessagePack (Buffer) to JS Object
var data = msgpack.unpack(buffer); // => {"foo": "bar"}

console.log(buffer, data)
console.log(buffer.toString('utf8'));

var share = '802dab1a0cfc40f809855c42a6f05e807dd8e12edacfd9fac62c4c2b5a425fd761a9d6f642bf1b3a268f652db7af18b2aff39a20927dddd110cee13e20b8368e8a5e173d92526b867ca9fe53cfca4fafbe471f7e41585e124f0b593aecb1db5c0ef13529115c7b8a0f91e64699e5de202ecb5303247ee86b0ea3c6233a3a801796bdfff561f1acf4e49017079f41fb9c657eae78aaf070dd3b9f3229d5a30e4439da31fb774d8ff03c31fb664e6f6c0705e9fe33c81c11ee68fc253fd31bb4171c226b89f302d929414d6cc3ea7ccdeb941693cf89cf0fddc8d4ebaf5f22c8f0cca1363ea078e305fcfedcfa551f26d0bd6b731998060eec8dd4ce4a0aeaf9fc71954c3139c55050e951d1ddd789a4d0d46045dd20106946f0180148a727d48246d9ed3495c885eb4cbed8984ab3ab97dd1';

var path = './tmp.png'
QRCode.toFile(path, share, {
  color: {
    dark: '#000000', // Blue modules
    light: '#FFFFFF' // Transparent background
  },
  mode: 'numeric'
  
}, function (err) {
  if (err) throw err
  console.log('saved.')
})
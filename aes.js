// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

var share='804aedcd2ba8193fc8382aeaeaa1dfdf619c3e28a9f391559e4d8382826f02d66c06d28947b3ec06e53ebfcb988591b222cc4a9c3a45a6f1580b27d0434fcf2500c6266a87d181e47c0b0e489bd2ffa78cd143035ed0c0e173ca35a69df787341c44594d2e2de9e74a5154d3ec7b3bb8e65e348f1842bcea315efba5fb6b2e4bb95d695c3740160f1557631b3c42b5527cef36e83c3074d0e286f4acd85ef15c044d4030eaa24f1679cab47a3812976097dca17e5f0fed7680016b1a464b532d232b7c317b51f4cad3a1cb4ec5384e0519524ed8daddae8b09829926ef8be9422c4b62c0c7acc1397e30df80437676c48950c679cf30cd7313f9469063539fd36562e166b2b1e50699397937a2e0a3ea3576c5b2967b3bda7b9e24810faf75c60c58c2286b1a37dfba282d21e59c0fe498f';
var enc = encrypt(share)
console.log(`encrypted share is: ${enc} its length is ${enc.length}`)
var dec = decrypt(enc)
console.log(`decrypted share is: ${dec} its length is ${dec.length}`)

var secrets = require('secrets.js-grempe');
var BIP39 = require('bip39');
console.clear()

//generate mnemomic
var mnemonic = BIP39.generateMnemonic(256)
console.log(`\n\n24 word mnemonic: ` + mnemonic);
console.log(`\nCharactor length of mnemonic: ${mnemonic.length}`)
//converting to hex
mnemonicHex = secrets.str2hex(mnemonic);
console.log(`\nCharactor length of mnemonic in hex: ${(secrets.str2hex(mnemonic).length)}`)

//devide into n of m shares
var threshold=3
var n=4

console.log(`\nDeviding in to ${n} shares with a threshold of ${threshold}: `)
var shares = secrets.share(secrets.str2hex(mnemonic), n, threshold)
for(i=0;i<n;i++)    {
    console.log(`\nshare ${i+1}, Hexadecimal: ` + shares[i]);
    console.log(`\nshare ${i+1}, Hexadecmal length: ` + (shares[i]).length);
    //Converting to 16bit charactor string
    console.log(`\nshare ${i+1}, 16 bit string: ` + secrets.hex2str(shares[i]));
    console.log(`\nshare ${i+1}, 16 bit string length: ` + (secrets.hex2str(shares[i])).length);
}

//combining 3 shares to re-create the original mnemonic
var receatedMnemonic = secrets.combine([shares[0], shares[2],shares[3]])

console.log(`\nRecreating mnemonic with share 1, 3 and 4`)
console.log(`\nRecreated mnemonic: ${secrets.hex2str(receatedMnemonic)}`)
console.log(`\nOriginal mnemonic: ${mnemonic}`)

const otp = Math.floor(Math.random() * 1e6);
console.log('otp: ' + otp);

function makeOTP(length) {
    var OTP = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++)
      OTP += possible.charAt(Math.floor(Math.random() * possible.length));
    return OTP;
  }
  console.log(makeOTP(8));

  var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  //var buf = Buffer.from(text,'hex');
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  //var buf1=Buffer.from(text,'hex');
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

var share=shares[0];//'804aedcd2ba8193fc8382aeaeaa1dfdf619c3e28a9f391559e4d8382826f02d66c06d28947b3ec06e53ebfcb988591b222cc4a9c3a45a6f1580b27d0434fcf2500c6266a87d181e47c0b0e489bd2ffa78cd143035ed0c0e173ca35a69df787341c44594d2e2de9e74a5154d3ec7b3bb8e65e348f1842bcea315efba5fb6b2e4bb95d695c3740160f1557631b3c42b5527cef36e83c3074d0e286f4acd85ef15c044d4030eaa24f1679cab47a3812976097dca17e5f0fed7680016b1a464b532d232b7c317b51f4cad3a1cb4ec5384e0519524ed8daddae8b09829926ef8be9422c4b62c0c7acc1397e30df80437676c48950c679cf30cd7313f9469063539fd36562e166b2b1e50699397937a2e0a3ea3576c5b2967b3bda7b9e24810faf75c60c58c2286b1a37dfba282d21e59c0fe498f';
console.log(`Original share is: ${share} its length is ${share.length}`)
var enc = encrypt(share)
console.log(`encrypted share is: ${enc} its length is ${enc.length}`)
var dec = decrypt(enc)
console.log(`decrypted share is: ${dec} its length is ${dec.length}`)

var test='71f3ba810e85e916b81b52dde99a6ded7cf314f55fafb86607e36e60531b1b66baa2dbf7fc731541e0619dd679d6bc0ea80d6fce1020998328be37494e2aadce85a6a2a62700d588ead219cbb4f3f70bed6fb31bfc14e009c30474b1a4086de435cd911b8b815edcc14ecd32a65f932e8e784ef02ff79cabf6a4c8cb10ff0b6a7c59374043c7c930d7f2630a7434c46cbf3af0f45b0c94a6dcfe8f0c42c1acdce1c6b3f4caea5f75846f0958ae9ffd34df45fb9120c4e0a382cd150d97133a0fbf5b40fe2e6ce65e76890161e0038010058bd535d6f5f78baa09a6c08eb97c2cc62ca0db5fdd9596aafffacc5c8cfde937c8751eeae8208211541877a5834ee1f9be91ec68444a79b6274945b4d89bad051e698aceeb83cd4fb5e056ea0246c2cff56c4f46bfc8f761de0f337f1edfe4853e461d8b8d34cdbced832c247ccd91e80111173edb250dc6ed80e4655ae289d0eaa5a0f65c9f518706b1e04afea8a5249b8711c04bdb93e5a26e5fee835056a6e1107caff08cd3fb9bcd71dd459a18dc302116373c77a646431e4a0776dcad7b69e7f62d6edda7b0904e50689440a4c6a30ea4b8c1d7e14ef498eaf31ef69ffa68763ce755a94b4dca09f9d599d76187ffe736852c7e733f20e798dfb7a1147ae74fded1efd3679e2fd3e4210acac03dad77f262aa7d6bb69cbd0d9b25d056c0491cd476d4b5d87cebca27fd3068c5ab5fa62506ec2c2c7ad8177803baa24d8c680ea21391dd39955281a4842b715bee9e683beee1d3d5e154eab1388a2a1882fe9f9e8458f934587d3d609fc8d9b701aba2e2dd756ded1ea963a83f4d1e9658dafcdefd6f357d605c145e94877780a414c597c93fa0df4c42a42106da2138f32fb118dda09cd7ad12b22903a4ec3b86b08989e8f7639f9baab6f89a2cb23dff4625bccef19004eeb943be3815f08c9b2453736fe077f8bcaf8a9859a568c31d5f6c33045af4a0308a41274e6b86c2a2a6f7760a993eed200a905162b21304c264bca5971ea84388bbe725da4c9e4d0e519f276abb76481935e1f523e9f01cd125a49665da3f0f1d5371eae2ac83fb2b4469f41ead0c7eb8e30b90fab9c291b9edc052b0413708e32d0432de3fa3406281deda535c5b8c85bf4576c705ab09d307a420dabebf87f06f2b5f025de88f12187a553dd01a71042c5695d5b6feb77c7f9dfdb5c6162eb0250eb21ba47b4b4a2cb93ac87344a1dde30b063da7b19f971a3de4946a22b76f9c0afac656393db69e4671e03c3315595eeca72f14342500a0700c4c6bace851bfbed77c65c629f6f74c43b9ec6799b04ebf74916288cda9f2192372d4f54eecd9567cf92eace00bf1d1ad29fd1d3cfc538520dfc5f90a4290c3cac542d2cd61db1535a48f94e42ff091ee3cce18ca680b907fdd1c4446b2e4d04be61da7d08e1c7663ab38691eeea6ac4f35846ac3eb692f055a844529734c93b2b2bf60ff31dc250896aa76ad7139a73a4d0150810d53d88c6b8eeecbd1debb49524a6a4d5ccfb9ae43f133b8d6c38543ab49bc2a5de67c20a7c0872b921463c1647c6df0a0278f660dd930d1da345c780834933eb6d6652673e994cdf21ed89d55080abd5498156c28097eee2a2870536822cf74cd4befb792e0cda3eaac9233c2579a6ccdbde63a437fea27ad7c2e236650d682d51e42eb496ce13cc522c763cd77ba63f1f0ccfce969c88ca0ad960d3adf393704182a8707555b8b1b3806afa517629aac3e3af4f03f2533cdd492467fbb8a0c6a4cd6b8ac09f490';
console.log(test.length)
console.log(secrets.hex2str(test));
console.log(secrets.hex2str(test).length)
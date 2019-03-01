var secrets = require('secrets.js-grempe');
var BIP39 = require('bip39');
console.clear()
//generate mnemomic
var mnemonic = BIP39.generateMnemonic(160)
console.log(`\n\n15 word mnemonic: ` + mnemonic);
console.log(`\n\nCharactor length of mnemonic: ${mnemonic.length}`)
//converting to hex
mnemonicHex = secrets.str2hex(mnemonic);
console.log(`\n\nCharactor length of mnemonic in hex: ${(secrets.str2hex(mnemonic).length)}`)

//devide into n of m shares
var threshold=3
var n=4

console.log(`\n\nDeviding in to ${n} shares with a threshold of ${threshold}: `)
var shares = secrets.share(secrets.str2hex(mnemonic), n, threshold)
for(i=0;i<n;i++)    {
    console.log(`\nshare ${i+1}, Hexadecimal: ` + shares[i]);
    console.log(`\nshare ${i+1}, Hexadecmal length: ` + (shares[i]).length);
    //Converting to 16bit charactor string
    console.log(`\nshare ${i+1}, 16 bit string: ` + secrets.hex2str(shares[i]));
    console.log(`\nshare ${i+1}, 16 bit string length: ` + (secrets.hex2str(shares[i])).length);
}

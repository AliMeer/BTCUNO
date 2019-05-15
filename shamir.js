
var crypto = require('crypto');
var secrets = require('secrets.js-grempe');
var BIP39 = require('bip39');
var uuidv4 = require('uuid/v4');


var answers = ['ONE', 'TWO'];
var encryptedShares = [];
    var cipherSpec = {
      algorithm: "aes-192-cbc",
      salt: "bithyeSalt", // NOTE: The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long
      keyLength: 24,
      iv: Buffer.alloc(16, 0),
    };
  
  function stringToHex(str) { secrets.str2hex(str);}

  function hexToString(hex) { secrets.hex2str(hex); }

  function generateMessageIDAndOTP(encryptedShare){
    const otp = Math.floor(Math.random() * 1e6);
    const intermediateKey = generateKey(`${otp}`);
    const key = crypto.scryptSync(
      intermediateKey,
       cipherSpec.salt,
       cipherSpec.keyLength,
    );

    const cipher = crypto.createCipheriv(
      cipherSpec.algorithm,
      key,
      cipherSpec.iv,
    );
    let encrypted = cipher.update(encryptedShare, "utf8", "hex");
    encrypted += cipher.final("hex");
    const otpEncryptedShare = encrypted;
    return {
      share: otpEncryptedShare,
      messageId: uuidv4(),
      otp,
    };
  }

  function generateShares(total, threshold, asnwers) {
    // threshold shares(m) of total shares(n) will enable the recovery of the mnemonic
   
    const shares = secrets.share(
      stringToHex('meat trust limit sausage market blame name tag chaos motion citizen giraffe hero rely top slogan push oppose match payment census art disease major'),
      total,
      threshold,
    );
    console.log(`inside generateShares ${shares[1]}`)
    return encryptor(asnwers, shares);
  }

  function generateKey(psuedoKey)  {
    const hashRounds = 5048;

    let key = psuedoKey;
    for (let itr = 0; itr < hashRounds; itr++) {
      const hash = crypto.createHash("sha512");
      key = hash.update(key).digest("hex");
    }
    return key;
  }

    function encryptor(answers, shares) {
        console.log('inside encryptor')
    const intermediateKey = generateKey(answers.join(""));
    const key = crypto.scryptSync(
      intermediateKey,
      cipherSpec.salt,
      cipherSpec.keyLength,
    ); // NOTE: The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long

    for (const share of shares) {
      const cipher = crypto.createCipheriv(
        cipherSpec.algorithm,
        key,
        cipherSpec.iv,
      );
      let encrypted = cipher.update(share, "utf8", "hex");
      encrypted += cipher.final("hex");
      console.log(encrypted)
      encryptedShares.push(encrypted);
    }
    return encryptedShares;
  }

console.log(generateShares[1]);
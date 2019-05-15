var bip39 = require('bip39');
var crypto = require('crypto');
var secrets = require('secrets.js-grempe');
var secrets = require('secrets.js-grempe');

console.clear()

//generate mnemomic
var mnemonic = bip39.generateMnemonic(256)
var cipherSpec = {
    algorithm: "aes-192-cbc",
    salt: "bithyeSalt", // NOTE: The salt should be as unique as possible. It is recommended that a salt is random and at least 16 bytes long
    keyLength: 24,
    iv: Buffer.alloc( 16, 0 ),
  };

console.log(`\n\n24 word mnemonic: ` + mnemonic);
console.log(`\nCharactor length of mnemonic: ${mnemonic.length}`)
//converting to hex
mnemonicHex = secrets.str2hex(mnemonic);
console.log(`\nCharactor length of mnemonic in hex: ${(secrets.str2hex(mnemonic).length)}`)

//devide into n of m shares
var threshold=3
var n=5

   stringToHex = ( str ) => secrets.str2hex( str );

   hexToString = ( hex ) => secrets.hex2str( hex );

   getShares = () => encryptedShares;

   generateShares = () => {
    // threshold shares(m) of total shares(n) will enable the recovery of the mnemonic
    threshold = threshold;
    const shares = secrets.share(
      stringToHex( mnemonic ),
      n,
      threshold,
    );

    for ( let itr = 0; itr < shares.length; itr++ ) {
      const checksum = calculateChecksum( shares[ itr ] );
      shares[ itr ] = shares[ itr ] + checksum;
    }

    return shares;
  }

   recoverFromShares = ( decryptedShares ) => {
    if ( decryptedShares.length >= threshold ) {
      try {
        const shares = [];
        for ( const share of decryptedShares ) {
          if ( validShare( share ) ) {
            shares.push( share.slice( 0, share.length - 4 ) );
          } else {
            throw new Error( `Invalid checksum, share: ${ share } is corrupt` );
          }
        }

        const recoveredMnemonicHex = secrets.combine( shares );
        return hexToString( recoveredMnemonicHex );
      } catch ( err ) {
        console.log( err );
      }
    } else {
      throw new Error(
        `supplied number of shares are less than the threshold (${
        threshold
        })`,
      );
    }
  }

   validateDecryption = ( decryptedShare, existingShares) => {
    if ( decryptedShare.meta.walletId === getWalletId() ) {
      throw new Error( "You're not allowed to be your own trusted party" );
    }

    if ( existingShares.length ) {
      for ( const share of existingShares ) {
        if ( share.meta.walletID === decryptedShare.meta.walletID ) {
          throw new Error(
            "You cannot store multiple shares from a single user.",
          );
        }
      }
    }

    return true;
  }

   getShareId = ( encryptedShare ) => {
    return crypto
      .createHash( "sha256" )
      .update( encryptedShare )
      .digest( "hex" );
  }

   initializeHealthcheck = async ( encryptedShares ) => {
    const shareIDs = [];
    for ( const encryptedShare of encryptedShares ) {
      shareIDs.push( getShareId( encryptedShare ) );
    }

    try {
      const res = await axios.post( config.SERVER + "/healthCheckInit", {
        walletID: getWalletId(),
        shareIDs,
      } );
      return {
        status: res.status,
        success: res.data.initSuccessful,
      };
    } catch ( err ) {
      return {
        status: 400,
        errorMessage: "Unable to initialize healthCheck",
      };
    }
  }

   addMeta = ( encryptedShare, tag ) => {
    const walletId = getWalletId();
    const timeStamp = new Date().toLocaleString( undefined, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    } );

    const share = {
      encryptedShare,
      meta: {
        validator: "HEXA",
        walletId,
        tag,
        timeStamp,
        info: `${ tag }'s sss share`,
      },
    };

    return JSON.stringify( share );
  }

   encryptShares = ( shares, answers ) => {
    const key = generateKey( answers.join( "" ) );
    var encryptedShares = [];
    // const key = crypto.scryptSync(
    //   intermediateKey,
    //   cipherSpec.salt,
    //   cipherSpec.keyLength,
    // );

    for ( const share of shares ) {
      const cipher = crypto.createCipheriv(
        cipherSpec.algorithm,
        key,
        cipherSpec.iv,
      );
      let encrypted = cipher.update( share, "utf8", "hex" );
      encrypted += cipher.final( "hex" );
      encryptedShares.push( encrypted );
    }
    return encryptedShares;
  }

   decryptShares = ( shares, answers ) => {
    const key = generateKey( answers.join( "" ) );
    // const key = crypto.scryptSync(
    //   intermediateKey,
    //   cipherSpec.salt,
    //   cipherSpec.keyLength,
    // );

    const decryptedShares = [];
    for ( const share of shares ) {
      const decipher = crypto.createDecipheriv(
        cipherSpec.algorithm,
        key,
        cipherSpec.iv,
      );
      let decrypted = decipher.update( share, "hex", "utf8" );
      decrypted += decipher.final( "utf8" );
      decryptedShares.push( decrypted );
    }
    return decryptedShares;
  }

   getWalletId = () =>
    crypto
      .createHash( "sha512" )
      .update( bip39.mnemonicToSeed( mnemonic ) )
      .digest( "hex" )

  validShare = ( checksumedShare ) => {
    const extractedChecksum = checksumedShare.slice( checksumedShare.length - 4 );
    const recoveredShare = checksumedShare.slice( 0, checksumedShare.length - 4 );
    const calculatedChecksum = calculateChecksum( recoveredShare );
    if ( calculatedChecksum !== extractedChecksum ) {
      return false;
    }
    return true;
  }

  calculateChecksum = ( share, rotation) => {
      rotation = 2;
    let temp = share;
    for ( let itr = 0; itr < rotation; itr++ ) {
      const hash = crypto.createHash( "sha512" );
      hash.update( temp );
      temp = hash.digest( "hex" );
    }

    return temp.slice( 0, 4 );
  }

  generateKey = ( psuedoKey ) => {
    const hashRounds = 5048;
    let key = psuedoKey;
    for ( let itr = 0; itr < hashRounds; itr++ ) {
      const hash = crypto.createHash( "sha512" );
      key = hash.update( key ).digest( "hex" );
    }
    return key.slice( key.length - cipherSpec.keyLength );
  }

//Services Functions


getShares = () => {
    answers = [makeRandomWord(6), makeRandomWord(7)]
    const shares = generateShares();
    const encryptedShares = encryptShares(shares, answers);
    return encryptedShares;
  }



//Calling services functions

console.log(`shares are `, getShares());

function makeRandomWord(length) {
    var OTP = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++)
      OTP += possible.charAt(Math.floor(Math.random() * possible.length));
    return OTP;
  }


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



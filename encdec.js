var eccrypto = require("eccrypto");
const ecies = require("eth-ecies");

//Bitcoin Key pair                 
const privateKey = "18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725";
const publicKey = "0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6";

//Ethereum key pair
const ethPublicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
const ethPrivateKey = '55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690';

//Data to be secretly sent
const data = '{data:"secret",moreData:100}';
let bufferData = Buffer.from(data);

//Using ETH-ECIES
    let userPublicKey = Buffer.from(ethPublicKey, 'hex');
    let encryptedByAlice = ecies.encrypt(userPublicKey, bufferData);
    console.log('Encrypted using ETH-ECIES: ' + encryptedByAlice.toString('base64'));
    let decryptedByBpb = ecies.decrypt(ethPrivateKey, encryptedByAlice);
    console.log('Decrypted: ' + decryptedByBpb)

//Using ECCRYPTO
eccrypto.encrypt(Buffer.from(publicKey, 'hex'), bufferData)
.then(encrypted =>   {
    console.log('Encrypted Using ECCRYPTO: '  + encrypted);
     eccrypto.decrypt(Buffer.from(privateKey, 'hex'), encrypted)
    .then((decrypted)=>  {
        console.log(`Decrypted Using ECCRYPTO: ${decrypted}`);
    });
})
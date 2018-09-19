var express = require('express');
var request = require("request");
var bodyparser = require('body-parser');
//var bitcore = require('bitcore-lib');
const Client = require('bitcoin-core');
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib');
const path = require('path');
var Datastore = require('nedb');
const blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3)


const serverDataPath = path.resolve(__dirname, 'data', 'serverDB');
const deviceAddressDataPath = path.resolve(__dirname, 'data', 'deviceAddressDB');
const deviceTxDataPath = path.resolve(__dirname, 'data', 'deviceTxDB')


serverDB = new Datastore({ filename: serverDataPath, autoload: true });
deviceAddressDB = new Datastore({ filename: deviceAddressDataPath, autoload: true });
deviceTxDB = new Datastore({ filename: deviceTxDataPath, autoload: true });


/*
var doc = {
    username: 'user1'
    , password: 'password'
};

serverDB.insert(doc);

var doc = {
    username: 'user1',
    address: '2MwUbhPK39Uia7HVma2a8fUS7QQc3vRaXd1',
    pubKey: '021e1d8d380097b67229c840e2a664054e7d9fe47e7a09888d6192a4a29ed5235b',
    multisig: false,
    privKey: '021e1d8d380097b67229c840e2a664054e7d9fe47e7a09888d6192a4a29ed5235b'
};

deviceAddressDB.insert(doc);

*/
const NW = bitcoin.networks.testnet;

function lencheck() {

    const testArray = [
        '025828e787a174df60099ad966ad5a5c5bdf1ba3d1aca0d90a62649442153bff85',
        '03d84d0513399571ab5269a3a4d1d6c2bcc564f43697dad3a81a95b360c3fb3cf4',
        '0286bd199ac9c97e3bedd1700e9e3be96164d597b76ddc6d2de81570242bac7f98',
        '03b5062a4f4429c29085f66aa33ec9bfe74e2142734bfb360b555246e88765d7ef',
        '0286bd199ac9c97e3bedd1700e9e3be96164d597b76ddc6d2de81570242bac7f98',
        '03b5062a4f4429c29085f66aa33ec9bfe74e2142734bfb360b555246e88765d7ef',
        '021e1d8d380097b67229c840e2a664054e7d9fe47e7a09888d6192a4a29ed5235b',
        '036992f45a904464638b217db4ca88e9b33ae9bdc8cc5661fcae99608f5b36d62f',
        '0272ecf2657fac699c0197a3ca78d14b125ad15141b66b610a877e188a55db663f',
        '03b2d3694ea7963456e6466ef7c093673d9020028289c4e0910b6d5a3ba648fc43',
        '03cd4aa75c8051ca67a18fb670737a37c369aa96b673aa76389a7c14a3e76db93a',
        '03bbe7f5ece8d6380898b73127a5a7c920d507a4f3e0a41ecea355dfaa9b4bfadd',
        '02205694327ae6efa624b0f620da7ceda984e59ad398876c6258fb4ce6c7a47742'
    ];
    for (i = 0; i < testArray.length; i++) {
        console.log("\nLength is: " + testArray[i].length);
    }
}
function saveKeyPair(username) {
    var { address, pubKey, privKey } = createKeyPair();
    var doc = {
        username: username,
        address: address,
        pubKey: pubKey,
        multisig: false,
        privKey: privKey
    };

    deviceAddressDB.insert(doc);

}
function createKeyPair(HD = false) {

    if (!HD) {
        const keyPair = bitcoin.ECPair.makeRandom(NW);
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NW })
        const publicKey = keyPair.publicKey.toString('hex');

        console.log("\ncreate Key createKeyPair...\n");
        console.log("\naddress: " + address);
        console.log("\npublic Key: " + publicKey);
        console.log("\n HD is " + HD);
        return ({ address: address, pubKey: publicKey, privKey: keyPair.toWIF() });
    }
    if (HD) {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeed(mnemonic);
        const root = bip32.fromSeed(seed);
        const path = "m/0'/0/0";
        const child1 = root.derivePath(path);
        const a = getAddress(child1);
        const pubKey = child1.publicKey.toString('hex');
        const privKey = child1.toWIF();
        console.log(
            "\n mnemonic is: " + mnemonic + "\n" +
            "\n address is: " + a + "\n" +
            "\n pubkey is: " + pubKey + "\n" +
            "\n PrivKey is: " + privKey + "\n"
        );
    }
}

function getAddress(node, network) {

    return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

var app = express();

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));

app.get("/action", function (req, res) {
    console.log("inside send");
    var address = req.query.address;
    var action = req.query.action;
    
    console.log("\nAddress is " + address + "\nAction is " + action);
    //res.sendFile(__dirname + "/anotherpage.html");
    res.write("\nAddress is " + address + "\nAction is " + action);
    res.end();

});

app.get("/", function (req, res) {

    //res.sendFile(__dirname + "/anotherpage.html");
    res.sendFile(__dirname + "/login.html");

});

app.post("/verify", function (req, res) {
    console.log("inside verify");
    var username = req.body.username;
    var password = req.body.password;
    var authenticated = false;
    console.log("\nUN is " + username + "\nPW is " + password);


    return serverDB.findOne({ username: username }, function (err, doc) {
        console.log("\n err is " + err + "\n doc is " + doc);
        if (err) authenticated = false;
        if (doc) {
            if (JSON.stringify(doc.password) == JSON.stringify(password)) {
                console.log("\nInside password equal");
                //return true;
                authenticated = true;
                //res.sendFile(__dirname + "/dashboard.html");
                showDashboard(res, username);

            }
            else {
                console.log("\nAthenticattion failed");
                res.sendFile(__dirname + "/relogin.html");
            }
        }
        if (doc == null) {
            console.log("Need to create new user");
            var doc = {
                username: username
                , password: password
            };
            serverDB.insert(doc);

            saveKeyPair(username);

            authenticated = true;
            //res.sendFile(__dirname + "/dashboard.html?test=5");
            showDashboard(res, username);

        }
    });
});

function showDashboard(res, username) {
    deviceAddressDB.find({ username: username }, function (err, doc) {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        console.log("\n err is " + err + "\n doc is " + doc);
        if (err) res.write("Error");
        if (doc) {
            console.log("\nInside doc equal" + doc);
            //res.sendFile(__dirname + "/dashboard.html");
            drawDashboard(res, doc, username);
        }
        else {
            console.log("Doc is null");
        }
    });
}
async function drawDashboard(res, doc, username) {
    res.write(
        ` 
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        a:link, a:visited, a:hover {
            color: #472a09;
            text-decoration: none;
        }
        a:active {
            color: #white;
            text-decoration: none;
        }
        
        #customers {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        
        #customers td, #customers th {
            border: 1px solid #c4ac91;
            padding: 8px;
        }
        
        #customers tr:nth-child(even){background-color: #f9ead9;}
        
        #customers tr:hover {background-color: #f7d2a8;}
        
        #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #f48709;
            color: white;
        }
        </style>
        </head>
        <body>
        <h1>${username}'s dashboard</h1>
        <table id="customers">
          <tr>
            <th width='50%'>Account</th>
            <th width='25%'>Balance(BTC)</th>
            <th width='25%'>Actions</th>
          </tr>
            `);
    console.log("\ndoc length is " + doc.length);
    for (i = 0; i < doc.length; i++) {
        bal = await blockexplorer.getBalance(doc[i].address);
        console.log("\nbalance is: " + JSON.stringify(bal[doc[i].address]));
        console.log("\nloop #" + i);
        res.write(

            ` <tr>
                    <td>${doc[i].address}</td>
                    <td>${Number((bal[doc[i].address].final_balance)/100000000).toFixed(5)}</td>
                    <td><a href='/action?address=${doc[i].address}&action=send'>Send</a> | <a href='/action?address=${doc[i].address}&action=joint'>Joint Account</a></td>
                </tr>`);

    }
    res.write(
        `
        </table>

</body>
</html>

        `
    );
    res.end();
}
app.post("/wallet", function (req, res) {

    var Balance = "";
    var formInput = req.body.formInput;
    console.log(formInput);
    var brainsrc = new Buffer(formInput);
    var hash = bitcore.crypto.Hash.sha256(brainsrc);
    var bn = bitcore.crypto.BN.fromBuffer(hash);
    var pk = new bitcore.PrivateKey(bn).toWIF();
    var addy = new bitcore.PrivateKey(bn).toAddress();
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(res.statusCode);
    request({
        url: "https://blockchain.info/address/" + addy + "?format=json",
        json: true
    }, function (error, response, body) {

        Balance = body.final_balance;
        console.log(Balance);
        res.write("Brain wallet: " + formInput + "<br><br>" +
            "Private Key: " + pk + "<br><br>" +
            "Public Address: " + addy + "<br><br>" +
            "Current Balance in Wallet: " + Balance + " BTC");
        res.end();
    });

});



app.listen(3001, function () {

    //createKeyPair(true);
    //lencheck();
    console.log("Server started and listening on port 3000");

});
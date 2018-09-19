const Client = require('bitcoin-core');
//const client = new Client({ network: 'testnet' });



//Digital Ocean creds
const digitalOceanPassword = 'TotallyRandom123mjaHgE4qWwQerDFgF';
const digitalOceanUser = 'Ulysseyswhoisthat';

//Local creds
const localPassword = 'TotallyRandom123mj';
const localUser = 'Ulysseyswhoisthat';

//Initiate client
const client = new Client(
    {
        username: localUser,
        password: localPassword,
        network: 'testnet'
    }
);
//client.getBlockchainInformation().then((help) => console.log(help));

//client.getBalance('*', 0).then((help) => console.log("Balance is: " + help));

//client.listAccounts().then((help) => console.log(help));
//client.getAccountAddress("").then((a) => console.log("Acc Address is: " + a));

//const balance = await new Client().getBalance('*', 0);
async function doWork() {

    let addressArray = [
        "2MwUbhPK39Uia7HVma2a8fUS7QQc3vRaXd1",
        "2Mybt3nMaxzyAZBcvuGVEBcVauAZfBFgjqG"

    ];
    publicKeyArray = [];
    for (i = 0; i < addressArray.length; i++) {
        validateAddress = await client.validateAddress(addressArray[i]);
        //console.log(validateAddress['pubkey']);
        publicKeyArray.push(validateAddress['pubkey']);
    }

    console.log(("publicKeyArray is \n\n"));
    console.log(
        publicKeyArray.toString()
    );

    multiSigOutput = await client.createMultiSig(2, publicKeyArray);

    console.log(
        "\nnew 2 of 2 multisig address: " + multiSigOutput['address'] + "\n" +
        "redeemScript: " + multiSigOutput['redeemScript']
    );

    privKeyArray = [
        "cPhbyy8x4V6idoC1U8KYZ6aDkoQgz5uqfE85dB1VVwgBrRKoDusT",
        "cRVPLMVMEVFXKNr82HC7mxoYSMPhpNzM76jCwuxkgJeU6YfbETvF"
    ];

    


    /* const addy = "2NFZJWjUQqm8YsTgEzuqNnv9UdgRYjSRmRh"
    //const a = await client.getNewAddress("Ali");
    //const a = await client.getAccountAddress("");
    const privK = await client.dumpPrivKey(addy);
    const balance = await client.getBalance("Ali");
    console.log(
         "public key: " + addy + "\n" +
         "private key: " + privK + "\n" +
         "Balance at this time is: " + balance
     );
     */

}


doWork();
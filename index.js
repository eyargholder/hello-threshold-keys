const { Client, PrivateKey, KeyList, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

// Generate our key lists
const privateKeyList = [];
const publicKeyList = [];
for (let i = 0; i < 6; i += 1) {
     // eslint-disable-next-line no-await-in-loop
     const privateKey = await PrivateKey.generate();
     const publicKey = privateKey.publicKey;
     privateKeyList.push(privateKey);
     publicKeyList.push(publicKey);
     console.log(`${i}: pub key:${publicKey}`);
     console.log(`${i}: priv key:${privateKey}`);
}

// Create our threshold key
const thresholdKey =  new KeyList(publicKeyList,33); 

console.log("The 1/3 threshold key structure" +thresholdKey);

//2.0.2

}
main();
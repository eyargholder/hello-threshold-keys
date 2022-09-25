const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, KeyList} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    // Generate our key lists
const privateKeyList = [];
const publicKeyList = [];
for (let i = 0; i < 7; i += 1) {
     // eslint-disable-next-line no-await-in-loop
     const privateKey = await PrivateKey.generate();
     const publicKey = privateKey.publicKey;
     privateKeyList.push(privateKey);
     publicKeyList.push(publicKey);
     console.log(`${i}: pub key:${publicKey}`);
     console.log(`${i}: priv key:${privateKey}`);
}

// Create our threshold key
const thresholdKey =  new KeyList(publicKeyList,2); 

console.log("The 1/3 threshold key structure" +thresholdKey);

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    const senderAccount = process.env.senderAccount;
    const recipientAccount = process.env.senderAccount;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(thresholdKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    //Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());
    
    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
     .setAccountId(newAccountId)
     .getCost(client);

    console.log("The cost of query is: " +queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +" tinybar.")
    
    //Create a transaction to schedule
     const transaction = new TransferTransaction()
     .addHbarTransfer(senderAccount, Hbar.fromTinybars(-1))
     .addHbarTransfer(recipientAccount, Hbar.fromTinybars(1));
     



//2.0.2

}
main();

const keyPair = require("./keypair.json");
const web3 = require("@solana/web3.js");

const tempArraySecret = Object.values(keyPair._keypair.secretKey);
const secret = new Uint8Array(tempArraySecret);
const account = web3.Keypair.fromSecretKey(secret);

console.log(account.publicKey.toString());

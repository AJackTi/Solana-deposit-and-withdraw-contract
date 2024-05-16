const keyPair = require("./keypair.json");
const web3 = require("@solana/web3.js");
const fs = require("fs");

const tempArraySecret = Object.values(keyPair._keypair.secretKey);
const secret = new Uint8Array(tempArraySecret);
const account = web3.Keypair.fromSecretKey(secret);

console.log("secret", secret);

let secretArray = [];
for (let i = 0; i < secret.length; i++) {
  secretArray.push(secret[i]);
}

fs.writeFileSync("./secret.json", JSON.stringify(secretArray));

console.log(account.publicKey.toString());

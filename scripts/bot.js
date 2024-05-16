// const { Connection, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");

// const WSS_ENDPOINT =
//   "wss://solana-devnet.g.alchemy.com/v2/FAf4EM7owcC2h5zgfyQLEDTEnC4_014P"; // replace with your URL
// const HTTP_ENDPOINT =
//   "https://solana-devnet.g.alchemy.com/v2/FAf4EM7owcC2h5zgfyQLEDTEnC4_014P"; // replace with your URL
// const solanaConnection = new Connection(HTTP_ENDPOINT, {
//   wsEndpoint: WSS_ENDPOINT,
// });
// const sleep = (ms) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

// (async () => {
//   const ACCOUNT_TO_WATCH = new PublicKey(
//     "9WgTPPReu2c7xujWNpZ6JqEt5bdNiBQZUsQojjNRTfsn"
//   );
//   const subscriptionId = await solanaConnection.onAccountChange(
//     ACCOUNT_TO_WATCH,
//     (updatedAccountInfo) =>
//       console.log(
//         `---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance:`,
//         updatedAccountInfo.lamports / LAMPORTS_PER_SOL,
//         " SOL"
//       ),
//     "confirmed"
//   );
//   console.log("Starting web socket, subscription ID: ", subscriptionId);
//   // await sleep(10000); //Wait 10 seconds for Socket Testing
//   // await solanaConnection.requestAirdrop(ACCOUNT_TO_WATCH, LAMPORTS_PER_SOL);
//   //   await sleep(10000); //Wait 10 for Socket Testing
//   //   await solanaConnection.removeAccountChangeListener(subscriptionId);
//   //   console.log(`Websocket ID: ${subscriptionId} closed.`);
// })();

// const solanaWeb3 = require("@solana/web3.js");
// const connection = new solanaWeb3.Connection(
//   "https://solana-devnet.g.alchemy.com/v2/FAf4EM7owcC2h5zgfyQLEDTEnC4_014P"
// );
// (async () => {
//   connection.onAccountChange(
//     new solanaWeb3.PublicKey("9WgTPPReu2c7xujWNpZ6JqEt5bdNiBQZUsQojjNRTfsn"),
//     (updatedAccountInfo, context) =>
//       console.log("Updated account info: ", updatedAccountInfo),
//     "confirmed"
//   );
// })();

// const web3 = require("@solana/web3.js");
// (async () => {
//   const publicKey = new web3.PublicKey(
//     "9WgTPPReu2c7xujWNpZ6JqEt5bdNiBQZUsQojjNRTfsn"
//   );
//   const solanaConnection = new web3.Connection(
//     "https://docs-demo.solana-mainnet.quiknode.pro/",
//     {
//       wsEndpoint: "wss://docs-demo.solana-mainnet.quiknode.pro/",
//     }
//   );
//   solanaConnection.onAccountChange(
//     publicKey,
//     (updatedAccountInfo, context) =>
//       console.log("Updated account info: ", updatedAccountInfo),
//     "confirmed"
//   );
// })();

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

// import {
//   offset as _offset,
//   seq as _seq,
//   Structure as _Structure,
//   u32,
//   u64,
//   u8,
// } from 'buffer-layout';

// import { Program } from '@project-serum/anchor';
// import * as BufferLayout from '@solana/buffer-layout';
// import { struct } from '@solana/buffer-layout';
// import {
//   bool,
//   publicKey,
// } from '@solana/buffer-layout-utils';
// import web3, { PublicKey } from '@solana/web3.js';

// import { DepositWithdraw } from '../target/types/deposit_withdraw';

// // anchor.setProvider(anchor.Provider.env());
// const program = Program<DepositWithdraw>;

// export interface RawMint {
//   mintAuthorityOption: 1 | 0;
//   mintAuthority: PublicKey;
//   supply: bigint;
//   decimals: number;
//   isInitialized: boolean;
//   freezeAuthorityOption: 1 | 0;
//   freezeAuthority: PublicKey;
// }

// const MintLayout = struct<RawMint>([
//   u32("mintAuthorityOption"),
//   publicKey("mintAuthority"),
//   u64("supply"),
//   u8("decimals"),
//   bool("isInitialized"),
//   u32("freezeAuthorityOption"),
//   publicKey("freezeAuthority"),
// ]);

// const WSS_ENDPOINT =
//   "wss://fluent-shy-snow.solana-devnet.quiknode.pro/1a88096faf16522a76df756dd236af812f4dce8c/"; // replace with your URL
// const HTTP_ENDPOINT =
//   "https://fluent-shy-snow.solana-devnet.quiknode.pro/1a88096faf16522a76df756dd236af812f4dce8c/"; // replace with your URL

// class DepositAccount {
//   amount = 0;
//   constructor(fields: { amount: number } | undefined = undefined) {
//     if (fields) {
//       this.amount = fields.amount;
//     }
//   }
// }

// const DepositSchema = new Map([
//   [DepositAccount, { kind: "struct", fields: [["amount", "u64"]] }],
// ]);

// /**
//  * @internal
//  */
// export type InstructionType = {
//   /** The Instruction index (from solana upstream program) */
//   index: number;
//   /** The BufferLayout to use to build data */
//   layout: BufferLayout.Layout<any>;
// };

// function decodeData(type: InstructionType, buffer: Buffer): any {
//   let data;
//   try {
//     data = type.layout.decode(buffer);
//   } catch (err) {
//     throw new Error("invalid instruction; " + err);
//   }

//   if (data.instruction !== type.index) {
//     throw new Error(
//       `invalid instruction; instruction index mismatch ${data.instruction} != ${type.index}`
//     );
//   }

//   return data;
// }

// export type PoolInstructionType = "Deposit";

// const POOL_INSTRUCTION_LAYOUTS: {
//   [type in PoolInstructionType]: InstructionType;
// } = Object.freeze({
//   Deposit: {
//     index: 241,
//     layout: BufferLayout.struct<any>([BufferLayout.u8("instruction")]),
//   },
// });

// (async () => {
//   const publicKey = new web3.PublicKey(
//     "DEdWPmyFcEZUZPYvixWWHzrUNBEa92bGvmJb8YMMzMCx"
//   );
//   const solanaConnection = new web3.Connection(HTTP_ENDPOINT, {
//     wsEndpoint: WSS_ENDPOINT,
//   });
//   solanaConnection.onAccountChange(
//     publicKey,
//     (updatedAccountInfo, context) => {
//       console.log("Updated account info data: ", updatedAccountInfo.data);
//       const deserialized = MintLayout.decode(updatedAccountInfo.data);
//       console.log(deserialized);

//       // console.log(
//       //   decodeData(POOL_INSTRUCTION_LAYOUTS.Deposit, updatedAccountInfo.data)
//       // );
//       // const message = borsh.deserialize(
//       //   DepositSchema,
//       //   DepositAccount,
//       //   updatedAccountInfo.data
//       // );
//       // console.log(message);
//     },
//     "confirmed"
//   );
// })();

// const WSS_ENDPOINT =
//   "wss://solana-devnet.g.alchemy.com/v2/FAf4EM7owcC2h5zgfyQLEDTEnC4_014P"; // replace with your URL
// const HTTP_ENDPOINT =
//   "https://solana-devnet.g.alchemy.com/v2/FAf4EM7owcC2h5zgfyQLEDTEnC4_014P"; // replace with your URL
// console.log("no error");
// const web3 = require("@solana/web3.js");
// (async () => {
//   const publicKey = new web3.PublicKey(
//     "A5KXGv2RWAMh2peKDWmnppF6FQgK3Rk3UCxyq5mV7nBb"
//   );
//   const solanaConnection = new web3.Connection(HTTP_ENDPOINT, {
//     wsEndpoint: WSS_ENDPOINT,
//   });
//   solanaConnection.onProgramAccountChange(
//     publicKey,
//     (updatedProgramInfo, context) =>
//       console.log("Updated program info: ", updatedProgramInfo),
//     "confirmed"
//   );
// })();


import 'dotenv/config';

import {
  BorshCoder,
  web3,
} from '../src';
import { IDL } from '../target/types/deposit_withdraw';

export const PROGRAM_PUBKEY = new web3.PublicKey(
  "EAroPm6A9s2Z48G8MTUh4k2qc1Nk3mTivxWcsCKZuQrn"
);

export const coder = new BorshCoder(IDL);

// export const RPC_URL =
//   process.env.RPC_URL ?? web3.clusterApiUrl("mainnet-beta");

export const RPC_URL =
  "https://empty-multi-pallet.solana-devnet.quiknode.pro/9910aab2cf401b080c5f01326be9d1747b3a0c7f/";

export const connection = new web3.Connection(RPC_URL);

export const commitment: web3.Commitment = "finalized";

export { IDL } from '../target/types/deposit_withdraw';

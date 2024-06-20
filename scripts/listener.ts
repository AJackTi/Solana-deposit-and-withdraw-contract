import BN from 'bn.js';

import {
  AnchorProvider,
  Program,
  setProvider,
  web3,
  workspace,
} from '@coral-xyz/anchor';
import {
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';

import { DepositWithdraw } from '../target/types/deposit_withdraw';

async function main() {
  const network = process.env.ANCHOR_PROVIDER_URL || clusterApiUrl("devnet");

  console.log("Listening to solXEN events on", network);

  const connection = new web3.Connection(network, "processed");
  const provider = new AnchorProvider(connection, {} as any, {});
  setProvider(provider);
  const program = workspace.DepositWithdraw as Program<DepositWithdraw>;

  let listener: number;

  const onHashEvent = (event: any) => {
    const { sender, amount, classType, back, body, head, bg, referralUrl } =
      event;

    console.log((sender as PublicKey).toBase58());
    console.log("amount", new BN(amount).toNumber() / LAMPORTS_PER_SOL);
    console.log("class_type", new BN(classType).toNumber());
    console.log("back", new BN(back).toNumber());
    console.log("body", new BN(body).toNumber());
    console.log("head", new BN(head).toNumber());
    console.log("bg", new BN(bg).toNumber());
    console.log("referral_url", referralUrl);
  };

  process.addListener("SIGINT", () => {
    if (listener) {
      program.removeEventListener(listener);
      console.log("done");
    }
    process.exit(0);
  });

  listener = program.addEventListener("Event", onHashEvent);

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

main()
  .then(() => {})
  .catch((err) => console.error(err));

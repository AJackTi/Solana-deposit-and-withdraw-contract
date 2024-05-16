import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DepositWithdraw } from "../target/types/deposit_withdraw";

import fs from "fs";

describe("init", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const provider = anchor.getProvider();

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  let poolKeypair = anchor.web3.Keypair.generate();
  fs.writeFileSync("./keypair.json", JSON.stringify(poolKeypair));
  let secretArray = [];
  for (let i = 0; i < poolKeypair.secretKey.length; i++) {
    secretArray.push(poolKeypair.secretKey[i]);
  }

  fs.writeFileSync("./secret.json", JSON.stringify(secretArray));
  console.log("pool", poolKeypair.publicKey.toBase58());

  it("init!", async () => {
    const [poolSigner, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
      [poolKeypair.publicKey.toBuffer()],
      program.programId
    );
    const totalPoolAmount: number = 78;

    const tx = await program.rpc.initialize(nonce, {
      accounts: {
        authority: provider.wallet.publicKey,
        pool: poolKeypair.publicKey,
        poolSigner: poolSigner,
        owner: provider.wallet.publicKey,
        vault: poolSigner,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [poolKeypair],
      instructions: [await program.account.pool.createInstruction(poolKeypair)],
    });

    console.log("Your transaction signature", tx);
  });
});
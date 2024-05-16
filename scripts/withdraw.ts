import assert from "assert";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DepositWithdraw } from "../target/types/deposit_withdraw";

import fs from "fs";

const poolSecret = JSON.parse(fs.readFileSync("./secret.json", "utf-8"));

describe("withdraw", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  const provider = anchor.getProvider();

  const poolKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(poolSecret)
  );

  console.log("Authority:", provider.wallet.publicKey.toBase58());
  console.log("Pool:", poolKeypair.publicKey.toBase58());

  it("Withdraw", async () => {
    const [poolSigner, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
      [poolKeypair.publicKey.toBuffer()],
      program.programId
    );

    const amount = anchor.web3.LAMPORTS_PER_SOL / 10;
    const tx = await program.rpc.withdraw(new anchor.BN(amount), {
      accounts: {
        pool: poolKeypair.publicKey,
        authority: provider.wallet.publicKey,
        vault: poolSigner,
        receiver: provider.wallet.publicKey,
        poolSigner: poolSigner,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });

    let contractLamports = await provider.connection.getBalance(poolSigner);
    assert.equal(contractLamports, 0);
  });
});

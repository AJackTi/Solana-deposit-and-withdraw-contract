import fs from "fs";

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

import { DepositWithdraw } from "../target/types/deposit_withdraw";

const poolSecret = JSON.parse(
  fs.readFileSync("../target/deploy/deposit_withdraw-keypair.json", "utf-8")
);

describe("balance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  const provider = anchor.getProvider();

  const poolKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(poolSecret)
  );
  // let poolKeypair = anchor.web3.Keypair.generate();

  console.log("Authority:", provider.wallet.publicKey.toBase58());
  console.log("Pool:", poolKeypair.publicKey.toBase58());

  it("Balance", async () => {
    const [poolSigner, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
      [poolKeypair.publicKey.toBuffer()],
      program.programId
    );

    let contractLamports = await provider.connection.getBalance(poolSigner);
    console.log("Contract balance", contractLamports);
  });
});

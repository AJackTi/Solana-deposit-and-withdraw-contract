import * as anchor from "@project-serum/anchor";
import assert from "assert";
import { Program } from "@project-serum/anchor";
import { DepositWithdraw } from "../target/types/deposit_withdraw";
import fs from "fs";

const poolSecret = JSON.parse(
  fs.readFileSync("./target/deploy/deposit_withdraw-keypair.json", "utf-8")
);

// Configure the client to use the local cluster.
anchor.setProvider(anchor.Provider.env());
const provider = anchor.getProvider();

const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

const poolKeypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(poolSecret)
);

async function main() {
  const [poolSigner, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
    [poolKeypair.publicKey.toBuffer()],
    program.programId
  );

  const amount = anchor.web3.LAMPORTS_PER_SOL / 10;
  const tx = await program.rpc.deposit(new anchor.BN(amount), {
    accounts: {
      pool: poolKeypair.publicKey,
      // authority: provider.wallet.publicKey,
      vault: poolSigner,
      depositor: provider.wallet.publicKey,
      poolSigner: poolSigner,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  let contractLamports = await provider.connection.getBalance(poolSigner);
  assert.equal(contractLamports, amount);
}

main();

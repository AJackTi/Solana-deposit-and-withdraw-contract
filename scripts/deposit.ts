import fs from 'fs';

import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { DepositWithdraw } from '../target/types/deposit_withdraw';

const poolSecret = JSON.parse(fs.readFileSync("./secret.json", "utf-8"));

describe("deposit", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  const provider = anchor.getProvider();

  const poolKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(poolSecret)
  );

  console.log("Authority:", provider.wallet.publicKey.toBase58());
  console.log("Pool:", poolKeypair.publicKey.toBase58());

  it("Deposit", async () => {
    const [poolSigner, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
      [poolKeypair.publicKey.toBuffer()],
      program.programId
    );

    const amount = anchor.web3.LAMPORTS_PER_SOL * 0.6;
    const tx = await program.rpc.deposit(new anchor.BN(amount), {
      accounts: {
        pool: poolKeypair.publicKey,
        authority: provider.wallet.publicKey,
        vault: poolSigner,
        depositor: provider.wallet.publicKey,
        poolSigner: poolSigner,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });

    console.log("Your transaction signature", tx);
    let contractLamports = await provider.connection.getBalance(poolSigner);
    console.log("Contract balance", contractLamports);
  });
});

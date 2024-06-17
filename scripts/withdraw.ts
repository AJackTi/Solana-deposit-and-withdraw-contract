import assert from 'assert';
import fs from 'fs';

import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { DepositWithdraw } from '../target/types/deposit_withdraw';

const poolSecret = JSON.parse(fs.readFileSync("./secret.json", "utf-8"));

describe("withdraw", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DepositWithdraw as Program<DepositWithdraw>;

  const provider = anchor.getProvider();

  const poolKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(poolSecret)
  );

  console.log("Authority:", provider.publicKey.toBase58());
  console.log("Pool:", poolKeypair.publicKey.toBase58());

  it("Withdraw", async () => {
    const [poolSigner, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
      [poolKeypair.publicKey.toBuffer()],
      program.programId
    );

    let balanceLamports = await provider.connection.getBalance(poolSigner);
    console.log("Contract balance", balanceLamports);

    const tx = await program.rpc.withdraw(new anchor.BN(balanceLamports), {
      accounts: {
        pool: poolKeypair.publicKey,
        authority: provider.publicKey,
        vault: poolSigner,
        receiver: provider.publicKey,
        poolSigner: poolSigner,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    console.log("Your transaction signature", tx);

    let contractLamports = await provider.connection.getBalance(poolSigner);
    console.log("Contract balance", contractLamports);
    assert.equal(contractLamports, 0);
  });
});

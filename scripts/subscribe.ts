import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
} from '@solana/web3.js';

import { getDetailSignature } from './getDetailSignature';

// Set up the connection to the Solana devnet
const connection = new Connection(
  "https://empty-multi-pallet.solana-devnet.quiknode.pro/9910aab2cf401b080c5f01326be9d1747b3a0c7f/"
);

// Replace with your program's public key
const PROGRAM_ID = new PublicKey(
  "ECfqyu2WUb4f44BKUD8PMBufYpHE4j37L3qAQGtwXoFB"
);

// Function to fetch and process signatures
async function fetchAndProcessSignatures(lastSignature?: string) {
  const options = lastSignature ? { before: lastSignature } : {};
  const signatures = await connection.getSignaturesForAddress(
    PROGRAM_ID,
    options
  );

  for (const signatureInfo of signatures) {
    await processTransaction(signatureInfo);
  }

  return signatures;
}

// Function to process a single transaction
async function processTransaction(signatureInfo: ConfirmedSignatureInfo) {
  const transaction = await connection.getTransaction(signatureInfo.signature);

  if (transaction && transaction.meta) {
    console.log("====================================");
    console.log("Transaction:", transaction.meta.logMessages);
    console.log("====================================");
    console.log("====================================");
    for (const signature of transaction.transaction.signatures) {
      console.log(
        `Signature: ${signature}, Detail: ${await getDetailSignature(
          signature
        )}`
      );
    }
    console.log("====================================");
    // const logMessages = transaction.meta.logMessages;

    // if (logMessages) {
    //   for (const log of logMessages) {
    //     console.log("Log:", log);
    // if (log.includes("Event")) {
    //   console.log("Found MyEvent log:", log);
    // }
    //   }
    // }
  }
}

// Main function to continuously listen for new events/logs
async function subscribeToEvents() {
  let lastSignature: string | undefined;

  while (true) {
    const signatures = await fetchAndProcessSignatures(lastSignature);

    if (signatures.length > 0) {
      lastSignature = signatures[signatures.length - 1].signature;
    }

    // Wait for 10 seconds before checking for new events
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

// Call the function to subscribe to events/logs
subscribeToEvents().catch((err) => {
  console.error("Error subscribing to events:", err);
});

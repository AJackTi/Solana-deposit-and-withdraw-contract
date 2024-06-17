import { map } from 'lodash';

import {
  convertValuesInAccount,
  getAccountsData,
  getProgramAccountsFromParsedTransaction,
} from '../src/';
import {
  coder,
  commitment,
  connection,
  IDL,
  PROGRAM_PUBKEY,
} from './constants';

const TXN_SIGNATURE =
  "3ApeRKCx8p8Fffp18Uyxhqq77NKzKGpmxj19e2LpZy3kai8vb1Mc7SukGxsY2cWKwNvFaKQUkxUi4rWA4ve5ueMC";

export async function getDetailSignature(signature: string) {
  try {
    const response = await connection.getParsedTransaction(signature, {
      commitment: "finalized",
      maxSupportedTransactionVersion: 2,
    });

    if (!response) {
      throw new Error("Error fetching txn");
    }

    const { transaction } = response;

    const accounts = getProgramAccountsFromParsedTransaction({
      programId: PROGRAM_PUBKEY,
      idl: IDL,
      coder,
      transaction,
    });

    connection.onProgramAccountChange;

    const { accountsData, emptyAccounts } = await getAccountsData({
      accounts,
      coder,
      commitment,
      connection,
      idl: IDL,
      programId: PROGRAM_PUBKEY,
    });

    console.log("====================================");
    console.log("accountsData, emptyAccounts", accountsData, emptyAccounts);
    console.log("====================================");

    const convertedAccounts = map(accountsData, ({ name, publicKey, data }) => {
      const convertedData = convertValuesInAccount(data, {
        bnParser: (v) => {
          try {
            return v.toNumber();
          } catch (err) {
            return 0;
          }
        },
        pubkeyParser: (v) => v.toBase58(),
      });

      return {
        name,
        publicKey: publicKey.toBase58(),
        data: convertedData,
      };
    });
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error(error);
  }
}

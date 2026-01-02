import dotenv from 'dotenv'
import pgp from "pg-promise";
dotenv.config();

const {
  DB_TYPE,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} = process.env;

export async function saveAccount(account: any) {
  const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
  await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
  await connection.$pool.end();
}

export async function getAccountById(accountId: string) {
  const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
  const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
  await connection.$pool.end();
  return accountData;
}

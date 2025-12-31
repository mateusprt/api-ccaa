import dotenv from 'dotenv'
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

dotenv.config();

const {
  DB_TYPE,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} = process.env;

if (!DB_TYPE || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
  throw new Error('Missing required environment variables for database connection.')
}

const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);

export async function signUp(input: any) {
  const accountId = crypto.randomUUID();
  if(!input.name || !input.name.match(/[a-zA-Z ]+ [a-zA-Z ]+/)) {
    throw new Error( "Invalid name" );
  }

  if(!input.email || !input.email.match(/.+@.+\..+/)) {
    throw new Error( "Invalid email" );
  }

  if(!input.document || !validateCpf(input.document)) {
    throw new Error( "Invalid document" );
  }

  if(!input.password || input.password.length < 8 || !input.password.match(/[a-z]/) || !input.password.match(/[A-Z]/) || !input.password.match(/[0-9]/)) {
    throw new Error( "Invalid password" );
  }

  await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [accountId, input.name, input.email, input.document, input.password]);
  return {
      accountId
  };
}

export async function getAccount(accountId: string) {
  const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
  return accountData;
}
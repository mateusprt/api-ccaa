import { validateCpf } from "./validateCpf";
import { AccountDAO } from './AccountDAO';

export default class SignUp {

  constructor(readonly accountDAO: AccountDAO) {}

  async execute(input: Input): Promise<Output> {
    const account = {
        accountId: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        document: input.document,
        password: input.password
    }
    if(!account.name || !account.name.match(/[a-zA-Z ]+ [a-zA-Z ]+/)) {
      throw new Error( "Invalid name" );
    }

    if(!account.email || !account.email.match(/.+@.+\..+/)) {
      throw new Error( "Invalid email" );
    }

    if(!account.document || !validateCpf(account.document)) {
      throw new Error( "Invalid document" );
    }

    if(!account.password || account.password.length < 8 || !account.password.match(/[a-z]/) || !account.password.match(/[A-Z]/) || !account.password.match(/[0-9]/)) {
      throw new Error( "Invalid password" );
    }

    await this.accountDAO.saveAccount(account)
    return {
        accountId: account.accountId
    };
  }
}

type Input = {
  name: string;
  email: string;
  document: string;
  password: string;
}

type Output = {
  accountId: string;
}


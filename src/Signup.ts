import Account from "./Account";
import { AccountDAO } from './AccountDAO';

export default class SignUp {

  constructor(readonly accountDAO: AccountDAO) {}

  async execute(input: Input): Promise<Output> {
    const account = Account.build({
      name: input.name,
      email: input.email,
      document: input.document,
      password: input.password
    });
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


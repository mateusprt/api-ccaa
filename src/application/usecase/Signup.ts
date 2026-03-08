import Account from "../../domain/Account";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";

export default class SignUp {

  @inject('accountRepository')
  accountRepository!: AccountRepository;

  async execute(input: Input): Promise<Output> {
    const account = Account.build({
      name: input.name,
      email: input.email,
      document: input.document,
      password: input.password
    });
    await this.accountRepository.saveAccount(account)
    return {
        accountId: account.getAccountId()
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


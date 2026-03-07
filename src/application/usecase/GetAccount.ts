import Asset from '../../domain/Asset';
import { inject } from '../../infra/di/Registry';
import AccountRepository, { AccountRepositoryDatabase } from '../../infra/repository/AccountRepository';

export default class GetAccount {

  @inject('accountRepository')
  accountRepository!: AccountRepository;

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getAccount(accountId);
    const output = {
      accountId: account.accountId,
      name: account.name,
      email:  account.email,
      document: account.document,
      password: account.password,
      assets: account.assets.map((asset: Asset) => ({
        assetId: asset.assetId,
        quantity: asset.quantity
      }))
    };
    return output;
  }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  document: string;
  password: string;
  assets: { assetId: string; quantity: number }[];
}

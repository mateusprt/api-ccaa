import { parse } from 'path';
import { AccountAssetDAO } from './AccountAssetDAO';
import { AccountDAO } from './AccountDAO';

export default class GetAccount {

  constructor(readonly accountDAO: AccountDAO, readonly accountAssetDAO: AccountAssetDAO) {}

  async execute(accountId: string): Promise<Output> {
    const accountData = await this.accountDAO.getAccountById(accountId);
    const accountAssetData = await this.accountAssetDAO.getAccountAssetsByAccountId(accountId);
    accountData.assets = accountAssetData.map((accountAsset: any) => ({
      assetId: accountAsset.asset_id,
      quantity: parseFloat(accountAsset.quantity)
    }));
    return accountData
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

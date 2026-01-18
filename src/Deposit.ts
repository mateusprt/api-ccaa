import { AccountAssetDAO } from './AccountAssetDAO';
import { AccountDAO } from './AccountDAO';

export default class Deposit {

  constructor(readonly accountDAO: AccountDAO, readonly accountAssetDAO: AccountAssetDAO) {}

  async execute(input: Input): Promise<void> {
    const account = await this.accountDAO.getAccountById(input.accountId);
    if(!account) throw new Error('Account not found');
    if(input.quantity <= 0) throw new Error('Quantity must be positive');
    const accountAsset = await this.accountAssetDAO.getAccountAssetsByAccountIdAndAssetId(input.accountId, input.assetId);
    if (!accountAsset) {
      const newAccountAsset = input;
      await this.accountAssetDAO.saveAccountAsset(newAccountAsset);
    } else {
      const updateAccountAsset = input;
      updateAccountAsset.quantity += parseFloat(accountAsset.quantity);
      await this.accountAssetDAO.updateAccountAsset(updateAccountAsset);
    }
  }
}

type Input = {
  accountId: string;
  assetId: string;
  quantity: number;
}

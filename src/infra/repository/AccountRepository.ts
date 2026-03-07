import Account from "../../domain/Account";
import Asset from "../../domain/Asset";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  getAccount(accountId: string): Promise<Account>;
  updateAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {

  @inject('connection')
  connection!: DatabaseConnection;


  async saveAccount(account: Account) {
    await this.connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
  }

  async updateAccount(account: Account): Promise<void> {
    await this.connection.query("delete from ccca.account_asset where account_id = $1", [account.accountId]);
    for (const asset of account.assets) {
      await this.connection.query("insert into ccca.account_asset (quantity, account_id, asset_id) values ($1, $2, $3)", [asset.quantity, account.accountId, asset.assetId]);
    }
  }

  async getAccount(accountId: string): Promise<Account> {
    const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
    const accountAssetsData = await this.connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
    const assets: Asset[] = []
    for(const accountAssetData of accountAssetsData) {
      assets.push(new Asset(accountAssetData.asset_id, parseFloat(accountAssetData.quantity)));
    }
    const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password, assets);
    return account;
  }
}
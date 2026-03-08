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

  @inject('databaseConnection')
  databaseConnection!: DatabaseConnection;


  async saveAccount(account: Account) {
    await this.databaseConnection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.getAccountId(), account.getName(), account.getEmail(), account.getDocument(), account.getPassword()]);
  }

  async updateAccount(account: Account): Promise<void> {
    await this.databaseConnection.query("delete from ccca.account_asset where account_id = $1", [account.getAccountId()]);
    for (const asset of account.getAssets()) {
      await this.databaseConnection.query("insert into ccca.account_asset (quantity, account_id, asset_id) values ($1, $2, $3)", [asset.quantity, account.getAccountId(), asset.assetId]);
    }
  }

  async getAccount(accountId: string): Promise<Account> {
    const [accountData] = await this.databaseConnection.query("select * from ccca.account where account_id = $1", [accountId]);
    const accountAssetsData = await this.databaseConnection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
    const assets: Asset[] = []
    for(const accountAssetData of accountAssetsData) {
      assets.push(new Asset(accountAssetData.asset_id, parseFloat(accountAssetData.quantity)));
    }
    const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password, assets);
    return account;
  }
}
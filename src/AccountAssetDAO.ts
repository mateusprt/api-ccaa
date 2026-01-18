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

export interface AccountAssetDAO {
  saveAccountAsset(accountAsset: any): Promise<void>;
  getAccountAssetsByAccountId(accountId: string): Promise<any>;
  getAccountAssetsByAccountIdAndAssetId(accountId: string, assetId: string): Promise<any>;
  updateAccountAsset(accountAsset: any): Promise<void>;
}

export class AccountAssetDAODatabase implements AccountAssetDAO {
  async saveAccountAsset(accountAsset: any) {
    const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
    await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [accountAsset.accountId, accountAsset.assetId, accountAsset.quantity]);
    await connection.$pool.end();
  }

  async getAccountAssetsByAccountId(accountId: string) {
    const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
    const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
    await connection.$pool.end();
    return accountAssetsData;
  }

  async getAccountAssetsByAccountIdAndAssetId(accountId: string, assetId: string) {
    const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
    const [accountAssetsData] = await connection.query("select * from ccca.account_asset where account_id = $1 and asset_id = $2", [accountId, assetId]);
    await connection.$pool.end();
    return accountAssetsData;
  }

  async updateAccountAsset(accountAsset: any) {
    const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
    await connection.query("update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3", [accountAsset.quantity,  accountAsset.accountId, accountAsset.assetId]);
    await connection.$pool.end();
  }
}

export class AccountAssetDAOMemory implements AccountAssetDAO {
  accountAssets: any[] = [];

  async saveAccountAsset(accountAsset: any) {
    this.accountAssets.push(accountAsset);
  }

  async getAccountAssetsByAccountId(accountId: string) {
    return this.accountAssets.filter(accountAsset => accountAsset.accountId === accountId);
  }
  async getAccountAssetsByAccountIdAndAssetId(accountId: string, assetId: string) {
    return this.accountAssets.find(accountAsset => accountAsset.accountId === accountId && accountAsset.assetId === assetId);
  }
  async updateAccountAsset(accountAsset: any) {
    const index = this.accountAssets.findIndex(a => a.accountId === accountAsset.accountId && a.assetId === accountAsset.assetId);
    if (index !== -1) {
      this.accountAssets[index] = accountAsset;
    }
  }
}

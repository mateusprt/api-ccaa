import Asset from "./Asset";
import { validateCpf } from "./validateCpf";
import { validateEmail } from "./validateEmail";
import { validateName } from "./validateName";
import { validatePassword } from "./validatePassword";
export default class Account {
  assets: Asset[] = [];

  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly document: string,
    readonly password: string,
    assets: Asset[]
  ) {
    if(!name || !validateName(name)) throw new Error( "Invalid name" );
    if(!email || !validateEmail(email)) throw new Error( "Invalid email" );
    if(!document || !validateCpf(document)) throw new Error( "Invalid document" );
    if(!password || !validatePassword(password)) throw new Error( "Invalid password" );
    this.assets = assets;
  }

  // padrão static factory method
  static create(name: string, email: string, document: string, password: string): Account {
    const accountId = crypto.randomUUID();
    const assets: Asset[] = [];
    return new Account(accountId, name, email, document, password, assets);
  }

  static build(accountBuilder: AccountBuilder): Account {
    const account = Account.create(
      accountBuilder.name,
      accountBuilder.email,
      accountBuilder.document,
      accountBuilder.password
    );
    return account;
  }

  deposit(assetId: string, quantity: number): void {
    if (quantity <= 0) throw new Error("Quantity must be positive");
    const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
    if (asset) {
      asset.quantity += quantity;
    } else {
      this.assets.push(new Asset(assetId, quantity));
    }
  }

  withdraw(assetId: string, quantity: number): void {
    if (quantity <= 0) throw new Error("Quantity must be positive");
    const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
    if (!asset || quantity > asset.quantity) throw new Error("Insufficient funds");
    asset.quantity -= quantity;
  }

  getBalance(assetId: string): number {
    const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
    if (!asset) return 0;
    return asset.quantity;
  }

}

type AccountBuilder = {
  name: string;
  email: string;
  document: string;
  password: string;
}
import Asset from "./Asset";
import CPF from "./CPF";
import Document from "./Document";
import Email from "./Email";
import Name from "./Name";
import Password from "./Password";
import UUID from "./UUID";

export default class Account {
  private name: Name;
  private email: Email;
  private document: Document;
  private password: Password;
  private cpf: CPF;
  private assets: Asset[] = [];

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
    assets: Asset[]
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.document = new Document(document);
    this.password = new Password(password); 
    this.cpf = new CPF(document);
    this.assets = assets;
  }

  // padrão static factory method
  static create(name: string, email: string, document: string, password: string): Account {
    const accountId = UUID.create().getValue();
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

  getAccountId(): string {
    return this.accountId;
  }

  getName(): string {
    return this.name.getValue();
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getDocument(): string {
    return this.document.getValue();
  }

  getPassword(): string {
    return this.password.getValue();
  }

  getAssets(): Asset[] {
    return this.assets;
  }

}

type AccountBuilder = {
  name: string;
  email: string;
  document: string;
  password: string;
}
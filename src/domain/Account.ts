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

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.document = new Document(document);
    this.password = new Password(password);
  }

  // padrão static factory method
  static create(name: string, email: string, document: string, password: string): Account {
    const accountId = UUID.create().getValue();
    return new Account(accountId, name, email, document, password);
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

  setPassword(newPassword: string): void {
    this.password = new Password(newPassword);
  }

}

type AccountBuilder = {
  name: string;
  email: string;
  document: string;
  password: string;
}
import { validateCpf } from "./validateCpf";
import { validateEmail } from "./validateEmail";
import { validateName } from "./validateName";
import { validatePassword } from "./validatePassword";

export default class Account {

  assets: Asset[] = []

  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly document: string,
    readonly password: string
  ) {
    if(!name || !validateName(name)) throw new Error( "Invalid name" );
    if(!email || !validateEmail(email)) throw new Error( "Invalid email" );
    if(!document || !validateCpf(document)) throw new Error( "Invalid document" );
    if(!password || !validatePassword(password)) {
      throw new Error( "Invalid password" );
    }
  }

  // padrão static factory method
  static create(name: string, email: string, document: string, password: string): Account {
    return new Account(crypto.randomUUID(), name, email, document, password);
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

}

type Asset = {
  assetId: string;
  quantity: number;
}

type AccountBuilder = {
  name: string;
  email: string;
  document: string;
  password: string;
}
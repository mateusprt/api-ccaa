import { AccountRepositoryDatabase } from "../src/AccountRepository";
import { PgPromiseAdapter } from "../src/DatabaseConnection";
import Deposit from "../src/Deposit";
import GetAccount from "../src/GetAccount";
import SignUp from "../src/Signup";

let signUp: SignUp;
let getAccount: GetAccount;
let deposit: Deposit;
let connection: PgPromiseAdapter;

beforeEach( () => {
	connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	signUp = new SignUp(accountRepository);
	getAccount = new GetAccount(accountRepository);
	deposit = new Deposit(accountRepository);
})

afterEach(async () => {
	await connection.close();
})

test("Deve fazer um depósito", async () => {
	const inputSignUp = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const outputSignup = await signUp.execute(inputSignUp);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: "BTC",
		quantity: 1
	}
	await deposit.execute(inputDeposit);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.assets).toHaveLength(1);
	expect(outputGetAccount.assets[0]?.assetId).toBe("BTC");
	expect(outputGetAccount.assets[0]?.quantity).toBe(1);
});

test("Deve fazer dois depósitos do mesmo asset", async () => {
	const inputSignUp = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const outputSignup = await signUp.execute(inputSignUp);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: "BTC",
		quantity: 1
	}
	await deposit.execute(inputDeposit);
	await deposit.execute(inputDeposit);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.assets).toHaveLength(1);
	expect(outputGetAccount.assets[0]?.assetId).toBe("BTC");
	expect(outputGetAccount.assets[0]?.quantity).toBe(2);
});

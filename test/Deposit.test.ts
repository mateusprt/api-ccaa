import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Deposit from "../src/application/usecase/Deposit";
import GetAccount from "../src/application/usecase/GetAccount";
import SignUp from "../src/application/usecase/Signup";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import Registry from "../src/infra/di/Registry";

let signUp: SignUp;
let getAccount: GetAccount;
let deposit: Deposit;
let connection: PgPromiseAdapter;

beforeEach( () => {
	connection = new PgPromiseAdapter();
	Registry.getInstance().register('databaseConnection', connection);
	Registry.getInstance().register('accountRepository', new AccountRepositoryDatabase());
	signUp = new SignUp();
	getAccount = new GetAccount();
	deposit = new Deposit();
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

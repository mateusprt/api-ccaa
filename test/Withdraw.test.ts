import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Deposit from "../src/application/usecase/Deposit";
import GetAccount from "../src/application/usecase/GetAccount";
import SignUp from "../src/application/usecase/Signup";
import Withdraw from "../src/application/usecase/Withdraw";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";

let signUp: SignUp;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;
let connection: PgPromiseAdapter;

beforeEach(() => {
	connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	signUp = new SignUp(accountRepository);
	getAccount = new GetAccount(accountRepository);
	deposit = new Deposit(accountRepository);
	withdraw = new Withdraw(accountRepository);
})

afterEach(async () => {
	await connection.close();
})

test("Deve fazer um saque", async () => {
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
		quantity: 2
	}
	await deposit.execute(inputDeposit);
	
	const inputWithdraw = {
		accountId: outputSignup.accountId,
		assetId: "BTC",
		quantity: 1
	}
	await withdraw.execute(inputWithdraw);
	
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.assets).toHaveLength(1);
	expect(outputGetAccount.assets[0]?.assetId).toBe("BTC");
	expect(outputGetAccount.assets[0]?.quantity).toBe(1);
});

test("Não deve fazer um saque", async () => {
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
	
	const inputWithdraw = {
		accountId: outputSignup.accountId,
		assetId: "BTC",
		quantity: 2
	}
	await expect(async () => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error('Insufficient funds'));
});
import { AccountAssetDAODatabase } from "../src/AccountAssetDAO";
import { AccountDAODatabase } from "../src/AccountDAO";
import Deposit from "../src/Deposit";
import GetAccount from "../src/GetAccount";
import SignUp from "../src/Signup";
import Withdraw from "../src/Withdraw";

let signUp: SignUp;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;

beforeEach( () => {
	const accountDAO = new AccountDAODatabase();
	const accountAssetDAO = new AccountAssetDAODatabase()
	signUp = new SignUp(accountDAO);
	getAccount = new GetAccount(accountDAO, accountAssetDAO);
	deposit = new Deposit(accountDAO, accountAssetDAO);
	withdraw = new Withdraw(accountDAO, accountAssetDAO);
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
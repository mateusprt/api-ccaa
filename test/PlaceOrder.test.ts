import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Deposit from "../src/application/usecase/Deposit";
import GetAccount from "../src/application/usecase/GetAccount";
import SignUp from "../src/application/usecase/Signup";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import Registry from "../src/infra/di/Registry";
import PlaceOrder from "../src/application/usecase/PlaceOrder";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";
import GetOrder from "../src/application/usecase/GetOrder";
import e from "cors";
import { WalletRepositoryDatabase } from "../src/infra/repository/WalletRepository";

let signUp: SignUp;
let getAccount: GetAccount;
let deposit: Deposit;
let connection: PgPromiseAdapter;
let placeOrder: PlaceOrder;
let getOrder: GetOrder;

beforeEach( () => {
	connection = new PgPromiseAdapter();
	Registry.getInstance().register('databaseConnection', connection);
	Registry.getInstance().register('accountRepository', new AccountRepositoryDatabase());
	Registry.getInstance().register('orderRepository', new OrderRepositoryDatabase());
	Registry.getInstance().register('walletRepository', new WalletRepositoryDatabase());
	placeOrder = new PlaceOrder();
	getOrder = new GetOrder();
	signUp = new SignUp();
	getAccount = new GetAccount();
	deposit = new Deposit();
})

afterEach(async () => {
	await connection.close();
})

test("Deve fazer uma ordem de compra", async () => {
	const inputSignUp = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const outputSignup = await signUp.execute(inputSignUp);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: "USD",
		quantity: 100000
	}
	await deposit.execute(inputDeposit);
	const inputPlaceOrder = {
		accountId: outputSignup.accountId,
		marketId: "BTC-USD",
		side: "buy",
		quantity: 1,
		price: 85000
	}
	const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
	expect(outputPlaceOrder.orderId).toBeDefined();
	const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
	expect(outputGetOrder.marketId).toBe("BTC-USD");
	expect(outputGetOrder.side).toBe("buy");
	expect(outputGetOrder.quantity).toBe(1);
	expect(outputGetOrder.price).toBe(85000);
	expect(outputGetOrder.status).toBe("open");
});

test("Não deve fazer uma ordem de compra com saldo insuficiente", async () => {
	const inputSignUp = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const outputSignup = await signUp.execute(inputSignUp);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: "USD",
		quantity: 50000
	}
	await deposit.execute(inputDeposit);
	const inputPlaceOrder = {
		accountId: outputSignup.accountId,
		marketId: "BTC-USD",
		side: "buy",
		quantity: 1,
		price: 85000
	}
	await (expect(placeOrder.execute(inputPlaceOrder))).rejects.toThrow("Insufficient funds");
});

test("Não deve fazer uma ordem de venda com saldo insuficiente", async () => {
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
	const inputPlaceOrder = {
		accountId: outputSignup.accountId,
		marketId: "BTC-USD",
		side: "sell",
		quantity: 2,
		price: 85000
	}
	await (expect(placeOrder.execute(inputPlaceOrder))).rejects.toThrow("Insufficient funds");
});
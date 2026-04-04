import Deposit from "../src/application/usecase/Deposit";
import GetAccount from "../src/application/usecase/GetAccount";
import GetOrder from "../src/application/usecase/GetOrder";
import PlaceOrder from "../src/application/usecase/PlaceOrder";
import SignUp from "../src/application/usecase/Signup";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Registry from "../src/infra/di/Registry";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";
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

test.only("Deve fazer uma ordem de compra e uma ordem de venda", async () => {
	const marketId = `BTC-USD-${Math.random()}`;
	const outputSignup = await signUp.execute({
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	});
	await deposit.execute({
		accountId: outputSignup.accountId,
		assetId: "USD",
		quantity: 100000
	});
	await deposit.execute({
		accountId: outputSignup.accountId,
		assetId: "BTC",
		quantity: 1
	});
	const outputPlaceOrder1 = await placeOrder.execute({
		accountId: outputSignup.accountId,
		marketId,
		side: "buy",
		quantity: 1,
		price: 85000
	});
	const outputPlaceOrder2 = await placeOrder.execute({
		accountId: outputSignup.accountId,
		marketId,
		side: "sell",
		quantity: 1,
		price: 83000
	});
	const outputGetOrder1 = await getOrder.execute(outputPlaceOrder1.orderId);
	const outputGetOrder2 = await getOrder.execute(outputPlaceOrder2.orderId);
	expect(outputGetOrder1.fillQuantity).toBe(1);
	expect(outputGetOrder1.fillPrice).toBe(85000);
	expect(outputGetOrder1.status).toBe("closed");
	expect(outputGetOrder2.fillQuantity).toBe(1);
	expect(outputGetOrder2.fillPrice).toBe(85000);
	expect(outputGetOrder2.status).toBe("closed");
});
import Wallet from "../src/domain/Wallet";

test("Não deve depositar quantidade negativa", async () => {
	const wallet = Wallet.create(crypto.randomUUID());
	expect(() => wallet.deposit("BTC", -100)).toThrow(new Error('Quantity must be positive'));
});

test("Deve fazer dois depósitos", async () => {
	const wallet = Wallet.create(crypto.randomUUID());
	wallet.deposit("BTC", 1);
	wallet.deposit("BTC", 1);
	expect(wallet.getBalance("BTC")).toBe(2);
});

test("Deve fazer um saque", async () => {
	const wallet = Wallet.create(crypto.randomUUID());
	wallet.deposit("BTC", 1);
	wallet.withdraw("BTC", 1);
	expect(wallet.getBalance("BTC")).toBe(0);
});

test("Não deve sacar quantidade negativa", async () => {
	const wallet = Wallet.create(crypto.randomUUID());
	expect(() => wallet.withdraw("BTC", -100)).toThrow(new Error('Quantity must be positive'));
});

test("Não deve sacar se não tiver fundos", async () => {
	const wallet = Wallet.create(crypto.randomUUID());
	wallet.deposit("BTC", 1);
	expect(() => wallet.withdraw("BTC", 2)).toThrow(new Error('Insufficient funds'));
});

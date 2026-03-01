import Account from "../src/domain/Account";

test("Não deve criar uma conta com nome inválido", async () => {
	expect(() => Account.create('John', 'john.doe@gmail.com', '97456321558', 'asdQWE123')).toThrow(new Error('Invalid name'));
});

test("Não deve criar uma conta com email inválido", async () => {
	expect(() => Account.create('John Doe', 'johndoegmail.com', '97456321558', 'asdQWE123')).toThrow(new Error('Invalid email'));
});

test("Não deve criar uma conta com documento inválido", async () => {
	expect(() => Account.create('John Doe', 'john.doe@gmail.com', '974563215', 'asdQWE123')).toThrow(new Error('Invalid document'));
});

test("Não deve criar uma conta com senha inválida", async () => {
	expect(() =>  Account.create('John Doe', 'john.doe@gmail.com', '97456321558', 'asdqwe')).toThrow(new Error('Invalid password'));
});


test("Não deve depositar quantidade negativa", async () => {
	const account = Account.create('John Doe', 'john.doe@gmail.com', '97456321558', 'asdQWE123');
	expect(() => account.deposit("BTC", -100)).toThrow(new Error('Quantity must be positive'));
});

test("Deve fazer dois depósitos", async () => {
	const account = Account.create('John Doe', 'john.doe@gmail.com', '97456321558', 'asdQWE123');
	account.deposit("BTC", 1);
	account.deposit("BTC", 1);
	expect(account.getBalance("BTC")).toBe(2);
});

test("Deve fazer um saque", async () => {
	const account = Account.create('John Doe', 'john.doe@gmail.com', '97456321558', 'asdQWE123');
	account.deposit("BTC", 1);
	account.withdraw("BTC", 1);
	expect(account.getBalance("BTC")).toBe(0);
});

test("Não deve sacar quantidade negativa", async () => {
	const account = Account.create('John Doe', 'john.doe@gmail.com', '97456321558', 'asdQWE123');
	expect(() => account.withdraw("BTC", -100)).toThrow(new Error('Quantity must be positive'));
});

test("Não deve sacar se não tiver fundos", async () => {
	const account = Account.create('John Doe', 'john.doe@gmail.com', '97456321558', 'asdQWE123');
	account.deposit("BTC", 1);
	expect(() => account.withdraw("BTC", 2)).toThrow(new Error('Insufficient funds'));
});

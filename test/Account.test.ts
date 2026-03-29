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
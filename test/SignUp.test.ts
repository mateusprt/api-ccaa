import sinon from "sinon";
import AccountService from "../src/GetAccount";
import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import SignUp from "../src/Signup";
import GetAccount from "../src/GetAccount";
import { AccountAssetDAODatabase, AccountAssetDAOMemory } from "../src/AccountAssetDAO";

let signUp: SignUp;
let getAccount: GetAccount;

beforeEach( () => {
	const accountDAO = new AccountDAODatabase();
	const accountAssetDAO = new AccountAssetDAODatabase();
	signUp = new SignUp(accountDAO);
	getAccount = new GetAccount(accountDAO, accountAssetDAO);
})

test("Deve criar uma conta", async () => {
	const input = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const outputSignup = await signUp.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve criar uma conta com nome inválido", async () => {
	const input = {
			name: "John",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}
	await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid name'));
});

test("Não deve criar uma conta com email inválido", async () => {
	const input = {
			name: "John Doe",
			email: "john.doe@gmail",
			document: "97456321558",
			password: "asdQWE123"
	}
	await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid email'));
});

test("Não deve criar uma conta com documento inválido", async () => {
	const input = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "974563215",
			password: "asdQWE123"
	}
	await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid document'));
});

test("Não deve criar uma conta com senha inválida", async () => {
	const input = {
			name: "John Dow",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE"
	}
    await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid password'));
});

test("Deve criar uma conta com stub", async () => {
	const input = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const saveStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
	const getStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves({ ...input, accountId: crypto.randomUUID() });
	const outputSignup = await signUp.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	saveStub.restore();
	getStub.restore();
});

test("Deve criar uma conta com spy", async () => {
	const input = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const saveSpy = sinon.spy(AccountDAODatabase.prototype, "saveAccount");
	const getSpy = sinon.spy(AccountDAODatabase.prototype, "getAccountById");
	const outputSignup = await signUp.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);

	expect(saveSpy.calledOnce).toBe(true);
	expect(getSpy.calledOnce).toBe(true);
	expect(getSpy.calledWith(outputSignup.accountId)).toBe(true);

	saveSpy.restore();
	getSpy.restore();
});

test("Deve criar uma conta com mock", async () => {
	const input = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}

	const mock = sinon.mock(AccountDAODatabase.prototype);
	mock.expects("saveAccount").once().resolves();
	mock.expects("getAccountById").once().resolves({...input, accountId: crypto.randomUUID()});
	const outputSignup = await signUp.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);

	mock.verify(); // Verifica se as expectativas foram atendidas
	mock.restore(); // Restaura o objeto original
});

test("Deve criar uma conta com fake", async () => {
	const accountDAO = new AccountDAOMemory();
	const accountAssetDAO = new AccountAssetDAOMemory();
	const signUp = new SignUp(accountDAO);
	const getAccount = new GetAccount(accountDAO, accountAssetDAO);
	const input = {
			name: "John Doe",
			email: "john.doe@gmail.com",
			document: "97456321558",
			password: "asdQWE123"
	}
	const outputSignup = await signUp.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
});
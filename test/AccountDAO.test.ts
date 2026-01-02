import { AccountDAOMemory } from "../src/AccountDAO";

test('Deve persistir uma account', async () => {

  const accountDAO = new AccountDAOMemory();
  const account = {
    accountId: crypto.randomUUID(),
    name: 'a',
    email: 'b',
    document: 'd',
    password: 'd'
  };
  await accountDAO.saveAccount(account);
  const savedAccount = await accountDAO.getAccountById(account.accountId);
  expect(savedAccount.name).toEqual(account.name);
  expect(savedAccount.email).toEqual(account.email);
  expect(savedAccount.document).toEqual(account.document);
  expect(savedAccount.password).toEqual(account.password);
})
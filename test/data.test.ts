import { getAccountById, saveAccount } from "../src/data";

test('Deve persistir uma account', async () => {
  const account = {
    accountId: crypto.randomUUID(),
    name: 'a',
    email: 'b',
    document: 'd',
    password: 'd'
  };
  await saveAccount(account);
  const savedAccount = await getAccountById(account.accountId);
  expect(savedAccount.name).toEqual(account.name);
  expect(savedAccount.email).toEqual(account.email);
  expect(savedAccount.document).toEqual(account.document);
  expect(savedAccount.password).toEqual(account.password);
})
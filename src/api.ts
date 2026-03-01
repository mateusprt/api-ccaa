import AccountController from './infra/AccountController';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import GetAccount from './application/usecase/GetAccount';
import { ExpressAdapter } from './infra/http/HttpServer';
import SignUp from "./application/usecase/Signup";
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';

async function main () {
    const httpServer = new ExpressAdapter();
    const connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const signUp = new SignUp(accountRepository)
    const getAccount = new GetAccount(accountRepository)
    new AccountController(httpServer, signUp, getAccount);
    httpServer.listen(3000);
}
main();
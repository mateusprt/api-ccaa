import AccountController from './infra/AccountController';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import GetAccount from './application/usecase/GetAccount';
import { ExpressAdapter } from './infra/http/HttpServer';
import SignUp from "./application/usecase/Signup";
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import Registry from './infra/di/Registry';

async function main () {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().register('httpServer', httpServer);
    Registry.getInstance().register('connection', new PgPromiseAdapter());
    Registry.getInstance().register('accountRepository', new AccountRepositoryDatabase());
    Registry.getInstance().register('signup', new SignUp());
    Registry.getInstance().register('getAccount', new GetAccount());
    new AccountController();
    httpServer.listen(3000);
}
main();
import GetAccount from "../application/usecase/GetAccount";
import HttpServer from "./http/HttpServer";
import SignUp from "../application/usecase/Signup";
import { inject } from "./di/Registry";

export default class AccountController {

  @inject('httpServer')
  httpServer!: HttpServer;

  @inject('signup')
  signUp!: SignUp;

  @inject('getAccount')
  getAccount!: GetAccount;

  constructor() {
    this.httpServer.route("post", "/signup", async (params: any, body: any) => {
      const input = body;
      const output = await this.signUp.execute(input)
      return output;
    });
    this.httpServer.route("get", "/accounts/:accountId", async (params: any) => {
      const accountId = params.accountId;
      const output = await this.getAccount.execute(accountId);
      return output;
    });
  }

}
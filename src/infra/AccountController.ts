import GetAccount from "../application/usecase/GetAccount";
import HttpServer from "./http/HttpServer";
import SignUp from "../application/usecase/Signup";

export default class AccountController {

  constructor(readonly httpServer: HttpServer, signUp: SignUp, getAccount: GetAccount) {
    httpServer.route("post", "/signup", async (params: any, body: any) => {
      const input = body;
      const output = await signUp.execute(input)
      return output;
    });
    httpServer.route("get", "/accounts/:accountId", async (params: any) => {
      const accountId = params.accountId;
      const output = await getAccount.execute(accountId);
      return output;
    });
  }

}
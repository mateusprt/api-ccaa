import cors from 'cors';
import express, { Request, Response } from "express";
import { AccountDAODatabase } from "./AccountDAO";
import SignUp from "./Signup";
import GetAccount from './GetAccount';
import { AccountAssetDAODatabase } from './AccountAssetDAO';

async function main () {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const accountDAO = new AccountDAODatabase()
    const accountAssetDAO = new AccountAssetDAODatabase()
    const signUp = new SignUp(accountDAO)
    const getAccount = new GetAccount(accountDAO, accountAssetDAO)
    
    app.post("/signup", async (req: Request, res: Response) => {
      try {
        const input = req.body;
        const output = await signUp.execute(input)
        res.json(output);
      } catch (err: any) {
        res.status(422).json({ message: err.message });
      }
    });

    app.get("/accounts/:accountId", async (req: Request, res: Response) => {
      const accountId = req.params.accountId || '';
      const output = await getAccount.execute(accountId);
      res.json(output);
    })

    app.listen(3000);
}
main();
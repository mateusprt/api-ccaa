import express, { Request, Response } from "express";
import cors from 'cors'
import { getAccount, signUp } from "./AccountService";

async function main () {
    const app = express();
    app.use(express.json());
    app.use(cors());
    
    app.post("/signup", async (req: Request, res: Response) => {
      try {
        const input = req.body;
        const output = await signUp(input)
        res.json(output);
      } catch (err: any) {
        res.status(422).json({ message: err.message });
      }
    });

    app.get("/accounts/:accountId", async (req: Request, res: Response) => {
      const accountId = req.params.accountId || '';
      const output = await getAccount(accountId);
      res.json(output);
    })

    app.listen(3000);
}
main();
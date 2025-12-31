import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

async function main () {

    dotenv.config();

    const {
      DB_TYPE,
      DB_USER,
      DB_PASSWORD,
      DB_HOST,
      DB_NAME
    } = process.env;

    if (!DB_TYPE || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
      throw new Error('Missing required environment variables for database connection.')
    }

    const connection = pgp()(`${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
    const app = express();
    app.use(express.json());
    
    app.post("/signup", async (req: Request, res: Response) => {
        const accountId = crypto.randomUUID();

        if(!req.body.name || !req.body.name.match(/[a-zA-Z ]+ [a-zA-Z ]+/)) {
          return res.status(422).json({ message: "Invalid name" });
        }

        if(!req.body.email || !req.body.email.match(/.+@.+\..+/)) {
          return res.status(422).json({ message: "Invalid email" });
        }

        if(!req.body.document || !validateCpf(req.body.document)) {
          return res.status(422).json({ message: "Invalid document" });
        }

        if(!req.body.password || req.body.password.length < 8 || !req.body.password.match(/[a-z]/) || !req.body.password.match(/[A-Z]/) || !req.body.password.match(/[0-9]/)) {
          return res.status(422).json({ message: "Invalid password" });
        }

        await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [accountId, req.body.name, req.body.email, req.body.document, req.body.password]);
        res.json({
            accountId
        });
    });

    app.get("/accounts/:accountId", async (req: Request, res: Response) => {
        const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [req.params.accountId]);
        res.json(accountData);
    })

    app.listen(3000);
}
main();
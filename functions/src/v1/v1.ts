import * as express from "express";
import auth from "./routes/auth";
import transaction from "./routes/transaction";
import Access from "./middlewares/access";

const main = express();

main.use(new Access().apiAccess);
main.use("/", [auth, transaction]);

export default main;

import * as express from "express";
import auth from "./routes/auth";
import Access from "./middlewares/access";

const main = express();

main.use(new Access().apiAccess);
main.use("/", [auth]);

export default main;

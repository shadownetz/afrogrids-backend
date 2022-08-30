import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as admin from "firebase-admin";

import v1 from "./v1/v1";
import UsersListener from "./v1/listeners/usersListener";
import ChatsListener from "./v1/listeners/chatsListener";

dotenv.config();
admin.initializeApp();

const userListener = new UsersListener();
const chatsListener = new ChatsListener();

const app = express();


app.use(cors({origin: true}));

app.use("/v1", v1);

exports.api = functions.https.onRequest(app);
exports.disableUserInventories = userListener.disableUserInventories;
exports.addMessageMetaInfo = chatsListener.addMessageMetaInfo;
// ./node_modules/.bin/eslint src --fix

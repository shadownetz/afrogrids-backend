import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as admin from "firebase-admin";

import v1 from "./v1/v1";
import UserListener from "./v1/listeners/users";

dotenv.config();
admin.initializeApp();

const userListener = new UserListener();

const app = express();


app.use(cors({origin: true}));

app.use("/v1", v1);

exports.api = functions.https.onRequest(app);
exports.disableUserInventories = userListener.disableUserInventories;
// ./node_modules/.bin/eslint src --fix
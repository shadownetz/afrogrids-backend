import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from 'dotenv';
import * as admin from "firebase-admin";

import v1 from "./v1/v1";

const app = express();

dotenv.config();
admin.initializeApp();


app.use(cors({
    origin: true
}));

app.use('/v1', v1);

exports.api = functions.https.onRequest(app);

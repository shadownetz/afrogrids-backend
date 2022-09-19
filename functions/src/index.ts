import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as admin from "firebase-admin";

import v1 from "./v1/v1";
import UsersListener from "./v1/listeners/usersListener";
import ChatsListener from "./v1/listeners/chatsListener";
import ReviewsListener from "./v1/listeners/reviewsListener";
import OrdersListener from "./v1/listeners/ordersListener";
import DeliveriesListener from "./v1/listeners/deliveriesListener";

dotenv.config();
admin.initializeApp();

const userListener = new UsersListener();
const chatsListener = new ChatsListener();
const reviewsListener = new ReviewsListener();
const ordersListener = new OrdersListener();
const deliveriesListener = new DeliveriesListener();

const app = express();


app.use(cors({origin: true}));

app.use("/v1", v1);

exports.api = functions.https.onRequest(app);
exports.disableUserInventories = userListener.disableUserInventories;
exports.addMessageMetaInfo = chatsListener.addMessageMetaInfo;
exports.calcUserRatings = reviewsListener.calcUserRatings;
exports.computeOrderFees = ordersListener.computeOrderFees;
exports.saveDeliveries = ordersListener.saveDeliveries;
exports.creditProvider = deliveriesListener.creditProvider;
// ./node_modules/.bin/eslint src --fix

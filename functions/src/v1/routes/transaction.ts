import * as express from "express";
import Access from "../middlewares/access";
import axios, {AxiosRequestConfig} from "axios";


const app = express();

app.get("/transaction", (req, res)=>{
  return res.send("Payment API");
});

app.post("/transaction/verify", new Access().tokenAccess, async (req, res)=>{
  try {
    const {transactionId, isTest}: {transactionId: string, isTest: boolean} = req.body;
    const _key = isTest? process.env.TEST_RAVE_SECRET_KEY: process.env.PROD_RAVE_SECRET_KEY;
    const config: AxiosRequestConfig = {
      method: "get",
      url: `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      headers: {
        "Authorization": `Bearer ${_key}`,
      },
    };
    const response = await axios(config);
    if (response.data.status === "success") {
      return res.status(200).json(response.data.data);
    }
    return res.status(404).send(response.data.message);
  } catch (e: any) {
    return res.status(404).json(e.message);
  }
});


export default app;

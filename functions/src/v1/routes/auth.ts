import * as express from "express";
import Access from "../middlewares/access";
import FuncUtils from "../utils/funcUtils";
// import Plugins from "../configs/plugins";
import {logger} from "firebase-functions";

const app = express();

app.get("/auth", (req, res)=>{
  return res.send("Hello world");
});

app.post("/auth/verify-phone", new Access().tokenAccess, async (req, res)=>{
  try {
    // TODO: Enable API during production
    const phone_code = FuncUtils.genVerCode;
    // const status = await Plugins.SMS_API.post("batches", {
    //     from: '447520651389',
    //     to: [req.body.phone],
    //     body: `Do not disclose this with anyone. Your One Time Password is ${phone_code}.`
    // });
    // console.log('<--------2FA SMS Sent Summary -------->');
    // console.info(JSON.stringify(status.data));
    // console.log('<--------End of Summary -------->');
    logger.log("Phone code is:", phone_code);
    return res.status(200).send(phone_code);
  } catch (e: any) {
    logger.error("Unable to send phone verification code::", e.message);
    return res.status(404).send("Unable to send phone verification code");
  }
});


export default app;

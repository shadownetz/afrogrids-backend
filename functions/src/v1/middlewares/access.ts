import {NextFunction, Request, Response} from "express";
import {logger} from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";


class Access {
  apiAccess(req: Request, res: Response, next: NextFunction) {
    const _clientKey = req.header("API-KEY");
    if (_clientKey) {
      if (_clientKey !== process.env.API_KEY) return res.status(403).send("Unauthorized Access!");
      else return next();
    } else {
      return res.status(404).send("API key not provided");
    }
  }

  async tokenAccess(req: Request, res: Response, next: NextFunction) {
    const TOKEN = req.header("X-ACCESS-TOKEN");
    if (TOKEN) {
      try {
        req.body.uid = (await new FirestoreReferences().authRef.verifyIdToken(TOKEN, true)).uid;
        return next();
      } catch (e: any) {
        logger.log("Invalid Token: ", e);
        return res.status(401).send(e.code == "auth/id-token-revoked"?"Authentication revoked, Login again to continue":"Invalid Token");
      }
    } else {
      return res.status(403).send("An access token is required for authentication");
    }
  }
}

export default Access;

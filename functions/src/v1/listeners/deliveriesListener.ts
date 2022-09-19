import * as functions from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";
import {DeliveryModel} from "../models/deliveryModel";

export default class DeliveriesListener {
  firestoreReference = new FirestoreReferences();
  usersReference = this.firestoreReference.usersRef;


  creditProvider = functions.firestore
      .document("deliveries/{deliveryId}")
      .onUpdate(async (snapshot)=>{
        const oldDelivery = snapshot.before.data();
        const delivery: DeliveryModel = snapshot.after.data() as DeliveryModel;
        if (oldDelivery.status !== delivery.status) {
          if (delivery.status == "COMPLETED") {
            const orderAmt = delivery.amount*delivery.deliveryCount;
            const adminFee = 0.1*orderAmt; // charge 10% fee per order transaction
            const balance = orderAmt-adminFee;
            await this.usersReference.doc(delivery.providerId).update({
              outstandingBalance: this.firestoreReference.firestore.FieldValue.increment(0-orderAmt),
              availableBalance: this.firestoreReference.firestore.FieldValue.increment(balance),
              netFees: this.firestoreReference.firestore.FieldValue.increment(adminFee),
            });
          }
        }
        return;
      });
}

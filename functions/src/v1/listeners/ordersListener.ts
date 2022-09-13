import * as functions from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";
import {InventoryModel} from "../models/inventoryModel";

export default class OrdersListener {
  firestoreReference = new FirestoreReferences();
  // ordersReference = this.firestoreReference.ordersRef;
  inventoriesReference = this.firestoreReference.inventoriesRef;
  usersReference = this.firestoreReference.usersRef;


  computeOrderFees = functions.firestore
      .document("orders/{orderId}")
      .onCreate(async (snapshot)=>{
        const order = snapshot.data();
        const orderAmt = parseFloat(order.totalPrice);
        const adminFee = 0.1*orderAmt; // charge 10% fee per order transaction
        const balance = orderAmt-adminFee;
        const inventoryPromises = order.items.map((item: any)=>this.inventoriesReference.doc(item.inventoryId).get());
        const inventories: Array<InventoryModel> = (await Promise.all(inventoryPromises)).map((inventory)=>new InventoryModel().fromFirestore(inventory));
        for (const inventory of inventories) {
          if (inventory !== undefined) {
            await this.usersReference.doc(inventory.createdBy).update({
              outstandingBalance: this.firestoreReference.firestore.FieldValue.increment(adminFee),
              availableBalance: this.firestoreReference.firestore.FieldValue.increment(balance),
            });
          }
        }
      });
}

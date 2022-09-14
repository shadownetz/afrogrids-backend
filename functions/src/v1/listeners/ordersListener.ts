import * as functions from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";
import {InventoryModel} from "../models/inventoryModel";
import {DeliveryModel} from "../models/deliveryModel";

export default class OrdersListener {
  firestoreReference = new FirestoreReferences();
  // ordersReference = this.firestoreReference.ordersRef;
  inventoriesReference = this.firestoreReference.inventoriesRef;
  usersReference = this.firestoreReference.usersRef;
  deliveriesReference = this.firestoreReference.deliveriesRef;


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

  saveDeliveries = functions.firestore
      .document("orders/{orderId}")
      .onCreate(async (snapshot)=>{
        const order = snapshot.data();
        const inventoryPromises = order.items.map((item: any)=>this.inventoriesReference.doc(item.inventoryId).get());
        const inventories: Array<InventoryModel> = (await Promise.all(inventoryPromises)).map((inventory)=>new InventoryModel().fromFirestore(inventory));
        const deliveries: Array<Record<string, any>> = [];
        const userDoc = await this.usersReference.doc(order.createdBy).get();
        if (userDoc.exists) {
          const user = userDoc.data();
          if (user) {
            for (let i=0; i < inventories.length; i++) {
              deliveries.push(
                  new DeliveryModel(
                      "",
                      inventories[i].createdBy,
                      inventories[i].id,
                      new Date(),
                      order.items[i].count,
                      userDoc.id,
                      `${user.firstName} ${user.lastName}`,
                      user.phone,
                      user.deliveryAddress,
                      "PROCESSING"
                  ).toJSON()
              );
            }
          }
        }
        if (deliveries.length > 0) {
          for (const delivery of deliveries) {
            await this.deliveriesReference.add(delivery);
          }
        }
      });
}

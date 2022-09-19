import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export class DeliveryModel {
  id: string;
  providerId: string;
  inventoryId: string;
  orderId: string;
  createdAt: Date;
  amount: number;
  deliveryCount: number;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAddress: string;
  status: string;

  constructor(id?: string, providerId?:string, amount?:number, inventoryId?: string, orderId?: string, createdAt?: Date, deliveryCount?: number, contactId?: string, contactName?: string, contactPhone?: string, contactAddress?: string, status?: string)
  constructor(id: string, providerId:string, amount:number, inventoryId: string, orderId: string, createdAt: Date, deliveryCount: number, contactId: string, contactName: string, contactPhone: string, contactAddress: string, status: string) {
    this.id = id;
    this.providerId = providerId;
    this.amount = amount;
    this.inventoryId = inventoryId;
    this.orderId= orderId;
    this.createdAt = createdAt;
    this.deliveryCount = deliveryCount;
    this.contactId = contactId;
    this.contactName = contactName;
    this.contactPhone = contactPhone;
    this.contactAddress = contactAddress;
    this.status = status;
  }

  toJSON(): Record<string, any> {
    const {
      amount,
      providerId,
      inventoryId,
      orderId,
      createdAt,
      deliveryCount,
      contactId,
      contactName,
      contactPhone,
      contactAddress,
      status,
    } = this;
    return {
      amount,
      providerId,
      inventoryId,
      orderId,
      createdAt: Timestamp.fromDate(createdAt),
      deliveryCount,
      contactId,
      contactName,
      contactPhone,
      contactAddress,
      status,
    };
  }


  fromFirestore(delivery: DocumentSnapshot): DeliveryModel {
    const data = delivery.data();
    this.id = delivery.id;
    if (data) {
      this.amount = data["amount"];
      this.providerId = data["providerId"];
      this.createdAt = data["createdAt"].toDate();
      this.inventoryId = data["inventoryId"];
      this.orderId = data["orderId"];
      this.deliveryCount = data["deliveryCount"];
      this.contactId = data["contactId"];
      this.contactName = data["contactName"];
      this.contactPhone = data["contactPhone"];
      this.contactAddress = data["contactAddress"];
      this.status = data["status"];
    }
    return this;
  }
}

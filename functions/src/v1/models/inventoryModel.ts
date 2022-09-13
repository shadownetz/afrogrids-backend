import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

export class InventoryModel {
  id: string;
  createdBy: string;
  createdAt: Date;
  name: string;
  price: number;
  currency: string;
  description: string;
  images: Array<string>;
  visible: boolean;

  constructor(id?: string, createdBy?: string, createdAt?: Date, name?: string, price?: number, currency?: string, description?: string, images?: Array<string>, visible?: boolean)
  constructor(id: string, createdBy: string, createdAt: Date, name: string, price: number, currency: string, description: string, images: Array<string>, visible: boolean) {
    this.id = id;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.name = name;
    this.price = price;
    this.currency = currency;
    this.description = description;
    this.images = images;
    this.visible = visible;
  }

  fromFirestore(inventory: DocumentSnapshot): InventoryModel {
    const data = inventory.data();
    this.id = inventory.id;
    if (data) {
      this.createdBy = data["createdBy"];
      this.createdAt = data["createdAt"].toDate();
      this.name = data["name"];
      this.price = data["price"];
      this.currency = data["currency"];
      this.description = data["description"];
      this.images = data["images"];
      this.visible = data["visible"];
    }
    return this;
  }
}

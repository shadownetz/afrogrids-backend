import * as admin from "firebase-admin";

class FirestoreReferences {
  firestore = admin.firestore;
  firestoreRef = this.firestore();
  authRef = admin.auth();
  usersRef = this.firestoreRef.collection("users");
  inventoriesRef = this.firestoreRef.collection("inventories");
  chatsRef = this.firestoreRef.collection("chats");
  ordersRef = this.firestoreRef.collection("orders");
}
export default FirestoreReferences;

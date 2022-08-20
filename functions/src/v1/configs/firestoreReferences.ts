import * as admin from "firebase-admin";

class FirestoreReferences {
  firestoreRef = admin.firestore();
  authRef = admin.auth();
  usersRef = this.firestoreRef.collection("users");
  inventoriesRef = this.firestoreRef.collection("inventories");
}
export default FirestoreReferences;

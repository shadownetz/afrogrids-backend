import * as functions from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";

class UserListener {
  inventoriesRef = new FirestoreReferences().inventoriesRef;

  disableUserInventories = functions.firestore
      .document("users/{userId}")
      .onUpdate(async (snapshot, context)=>{
        const prevData = snapshot.before.data();
        const newData = snapshot.after.data();
        if (prevData.serviceType !== newData.serviceType) {
          const inventoriesQuerySnapshot = await this.inventoriesRef
              .where("createdBy", "==", context.params.userId)
              .where("visible", "==", true)
              .get();
          const promises = inventoriesQuerySnapshot.docs.map((doc)=>{
            return this.inventoriesRef.doc(doc.id).update({visible: false});
          });
          await Promise.all(promises);
        }
        return;
      });
}


export default UserListener;

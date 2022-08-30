import * as functions from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";

class ChatsListener {
  firestoreReference = new FirestoreReferences();
  chatsReference = this.firestoreReference.chatsRef;

  addMessageMetaInfo = functions.firestore
      .document("chats/{chatId}/messages/{messageId}")
      .onCreate(async (snapshot, context)=>{
        const newData = snapshot.data();
        const params = context.params;
        const updateData = {
          lastMsg: newData.content,
          lastMsgTimestamp: newData.createdAt,
        };
        await this.chatsReference.doc(params.chatId).collection("meta").doc("stats")
            .set(updateData);
      });
}


export default ChatsListener;

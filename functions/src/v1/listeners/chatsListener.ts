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
            .update(updateData);
      });

  addChatIdForUsers = functions.firestore
      .document("chats/{chatId}")
      .onCreate(async (snapshot, context)=>{
        const newData = snapshot.data();
        const params = context.params;
        await this.firestoreReference.usersMeta
            .doc(newData.createdBy).collection("chat")
            .doc(newData.createdFor).create({
              chatId: params.chatId,
              createdAt: this.firestoreReference.firestore.FieldValue.serverTimestamp(),
            });
        await this.firestoreReference.usersMeta
            .doc(newData.createdFor).collection("chat")
            .doc(newData.createdBy).create({
              chatId: params.chatId,
              createdAt: this.firestoreReference.firestore.FieldValue.serverTimestamp(),
            });
      });
}


export default ChatsListener;

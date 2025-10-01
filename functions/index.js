const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.sendChatNotification = functions.firestore
  .document("messages/{chatId}/chats/{messageId}")
  .onCreate(async (snapshot, context) => {
    const msg = snapshot.data();
    const { senderId, receiverId, text } = msg;

    const userDoc = await db.collection("users").doc(receiverId).get();
    if (!userDoc.exists) return null;

    const token = userDoc.data().fcmToken;
    if (!token) return null;

    const payload = {
      notification: {
        title: "Pesan Baru",
        body: text,
        icon: "https://artsite07.github.io/thechat/assets/icon-192.png"
      },
      data: {
        chatId: context.params.chatId,
        senderId
      }
    };

    return admin.messaging().sendToDevice(token, payload);
  });

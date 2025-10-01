const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// URL ikon yang konsisten digunakan di Cloud Function dan Service Worker
const NOTIFICATION_ICON_URL = "https://artsite07.github.io/thechat/assets/icon-192.png";

exports.sendChatNotification = functions.firestore
  .document("messages/{chatId}/chats/{messageId}")
  .onCreate(async (snapshot, context) => {
    const msg = snapshot.data();
    const { senderId, receiverId, text } = msg;

    try {
      // 1. Ambil token FCM penerima
      const userDoc = await db.collection("users").doc(receiverId).get();
      if (!userDoc.exists) {
        console.log(`User document for receiverId ${receiverId} not found.`);
        return null;
      }

      const token = userDoc.data().fcmToken;
      if (!token) {
        console.log(`FCM Token for receiverId ${receiverId} not found.`);
        return null;
      }

      // 2. Buat payload notifikasi
      const payload = {
        notification: {
          title: "Pesan Baru",
          body: text,
          icon: NOTIFICATION_ICON_URL, // Menggunakan URL yang konsisten
          // Notifikasi klik akan diarahkan ke path default aplikasi.
        },
        data: {
          chatId: context.params.chatId,
          senderId,
          // Ini membantu klien menangani klik notifikasi
          click_action: "FLUTTER_NOTIFICATION_CLICK", 
        }
      };

      // 3. Kirim pesan
      const response = await admin.messaging().sendToDevice(token, payload);
      console.log('Successfully sent message:', response);
      
      // Penanganan token yang rusak atau tidak aktif
      const invalidTokens = [];
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', token, error);
          // Token tidak terdaftar atau tidak valid. Hapus dari database.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(token);
          }
        }
      });
      
      // Opsional: Logika untuk menghapus token yang tidak valid dari Firestore
      if (invalidTokens.length > 0) {
        console.log('Removing invalid token:', invalidTokens[0]);
        await db.collection("users").doc(receiverId).update({ fcmToken: admin.firestore.FieldValue.delete() });
      }

      return response;
    } catch (error) {
      console.error('Error sending chat notification:', error);
      return null;
    }
  });

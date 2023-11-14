/**
 * Wavelet Packet Processing in Serverless Functions
 *
 * This script is a Serverless Function designed to process wavelet packets received through
 * Messaging Queue. It focuses on handling and storing data related to asset tracking, 
 * specifically by mapping tag IDs to asset IDs and managing packet data in Firestore.
 * These documents are used to render wavelets on the UI.
 *
 * Key Operations:
 * - Parses incoming Queue messages to extract wavelet packet data.
 * - Retrieves asset IDs from a 'tag-asset-mapping' collection in Firestore based on the tag ID in the event.
 * - Checks a configuration document ('wavelet-dev/selectedAsset') to determine if packet processing is enabled
 *   and if the asset ID is among the selected assets for tracking.
 * - If conditions are met, stores packet data in a subcollection under the 'selectedAsset' document, 
 *   including bridge ID, RSSI, and a generated UUID.
 *
 * Environment Setup:
 * - Requires Firebase Admin SDK for Firestore and Cloud Functions SDK.
 * - Utilizes a service account for Firebase Admin SDK initialization.
 * - Firestore database is initialized for data operations.
 *
 * Error Handling:
 * - Includes error handling to manage issues in data retrieval or processing.
 * - Logs errors to the console for debugging and monitoring purposes.
 *
 * Note:
 * - The script assumes a specific Firestore data structure and is tailored to handle events
 *   with specific data fields (tagId, bridgeId, RSSI).
 * - Proper configuration of Firestore collections and document structure is crucial for the
 *   correct operation of this function.
 */

const admin = require("firebase-admin");
process.env.GCLOUD_PROJECT = "wiliot-asset-tracking";
const functions = require("firebase-functions");
const serviceAccount = require("./service-account.json");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.processWaveletPackets = async (event, context) => {
  try {
    // Parse the Pub/Sub message data
    const eventData = JSON.parse(Buffer.from(event.data, "base64").toString());

    // Getting stored assetId from tagId
    let assetId = null;
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection("tag-asset-mapping").doc(eventData.tagId);
      const documentSnapshot = await transaction.get(docRef);

      if (documentSnapshot.exists) {
        assetId = documentSnapshot.data().assetId;
      } else {
        console.error("No mapping found for tagId: " + eventData.tagId);
        throw new Error("No mapping found for tagId: " + eventData.tagId);
      }
    });

    // Check if processPubSubMessages is true
    const configRef = db.collection("wavelet-dev").doc("selectedAsset");
    const configSnapshot = await configRef.get();
    const configData = configSnapshot.data();
    console.log(configData);

    if (configData && configData.processPubSubMessages) {
      // Check if the assetId matches the currently selected assetId in Firestore

      console.log("configData.assetIds", configData.assetIds);
      console.log("assetId is ", assetId);

      if (configData.assetIds.includes(assetId)) {
        const packetData = {
          bridgeId: eventData.value.bridgeId,
          timestamp: new Date(), // Current timestamp
          rssi: eventData.value.RSSI,
          rendered: false,
          uuid: uuidv4(),
        };
        console.log("adding packet data to packets subcollection", packetData);
        await configRef.collection(assetId).add(packetData);
      }
    }
  } catch (error) {
    console.error("Error processing event", error);
  }
};

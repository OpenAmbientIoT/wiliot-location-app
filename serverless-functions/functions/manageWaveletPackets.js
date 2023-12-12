/**
 * Firestore Wavelet Packet Management in Serverless Functions
 *
 * This script is designed to be deployed as a Serverless Function. It monitors and handles
 * updates to a specific Firestore document ("wavelet/selectedAsset"). The function is triggered
 * by any update to this document and performs various operations based on the nature of the update.
 * It manages the processing of incoming packets to add to the collection and have wavelets rendered.
 *
 * Key Operations:
 * - When the 'assetIds' field in the document changes from non-empty to empty, the script deletes
 *   all associated collections and sets 'processPubSubMessages' to false.
 * - When 'assetIds' changes from empty to non-empty, it sets 'processPubSubMessages' to true,
 *   indicating the start of processing messages for the added assets.
 * - If the array of 'assetIds' is reduced, the script identifies the removed assets and deletes
 *   their corresponding collections.
 *
 * Environment Setup:
 * - The script requires the Firebase Admin SDK and Firebase Functions SDK.
 * - It uses a service account for Firebase Admin SDK initialization.
 * - The Firestore database is initialized for data operations.
 * - The script assumes a specific data structure in Firestore and is tailored to a specific use case
 *   involving wavelet packet management.
 *
 * Note:
 * - The script includes comprehensive logging for each operation, aiding in debugging and monitoring.
 * - It is crucial to ensure that the Firestore data structure and the document paths used in the script
 *   match the actual Firestore setup for the function to work correctly.
 */

const admin = require("firebase-admin");
process.env.GCLOUD_PROJECT = "my-project";
const functions = require("firebase-functions");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.manageWaveletPackets = functions.firestore
  .document("wavelet/selectedAsset")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    const configRef = db.collection("wavelet-boutique").doc("selectedAsset");

    console.log("Previous Value:", previousValue);
    console.log("New Value:", newValue);

    // Checking if assetID was changed from being non-empty to empty, delete all collections
    if (previousValue.assetIds.length > 0 && newValue.assetIds.length === 0) {
      console.log("Deleting all packets collections");
      // Update the config document to set processPubSubMessages to false
      await configRef.set({ processPubSubMessages: false }, { merge: true });
      console.log("Config is set to false");

      // getting all collection ids
      const collections = await db
        .collection("wavelet-boutique")
        .doc("selectedAsset")
        .listCollections();
      const collectionIds = collections.map((collection) => collection.id);

      await collectionIds.forEach(async (collectionId) => {
        const batch = admin.firestore().batch();
        // Delete the documents in the packets collection
        const packetsCollectionRef = db
          .collection("wavelet-boutique")
          .doc("selectedAsset")
          .collection(collectionId);
        const snapshots = await packetsCollectionRef.get();

        snapshots.docs.forEach((doc) => {
          console.log("deleting doc: ", doc.id);
          batch.delete(doc.ref);
        });
        await batch.commit();
      });

      // Checking if assetID was changed from being empty to non-empty
    } else if (
      previousValue.assetIds.length === 0 &&
      newValue.assetIds.length > 0
    ) {
      console.log("Added asset to track, processing messages.");
      // Update the config document to set processPubSubMessages to true
      await configRef.set({ processPubSubMessages: true }, { merge: true });
      console.log("Config is set to true");

      // checking if array of assetIds subtracted one, and deleting those packet collection docs
    } else if (previousValue.assetIds.length > newValue.assetIds.length) {
      console.log("Checking for different assets.");
      // getting removed elements
      const removedAssetIds = previousValue.assetIds.filter(
        (x) => !newValue.assetIds.includes(x)
      );

      await removedAssetIds.forEach(async (removedAssetId) => {
        const batch = admin.firestore().batch();
        console.log("removing assetId: ", removedAssetId);

        // Delete the documents in the packets collection
        const packetsCollectionRef = db
          .collection("wavelet-boutique")
          .doc("selectedAsset")
          .collection(removedAssetId);
        const snapshots = await packetsCollectionRef.get();

        console.log("length of snapshots: ", snapshots.docs.length);
        snapshots.docs.forEach((doc) => {
          console.log("deleting doc: ", doc.id);
          batch.delete(doc.ref);
        });
        await batch.commit();
      });
    }

    return null;
  });

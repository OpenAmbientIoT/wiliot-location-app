const admin = require('firebase-admin');
process.env.GCLOUD_PROJECT = 'wiliot-asset-tracking';
const functions = require('firebase-functions');
const serviceAccount = require('./service-account.json');
const { v4: uuidv4 } = require('uuid');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.processWaveletPackets = async (event, context) => {
  try {
        // Parse the Pub/Sub message data
        const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString());
        
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
        const configRef = db.collection('wavelet-dev').doc('selectedAsset');
        const configSnapshot = await configRef.get();
        const configData = configSnapshot.data();
        console.log(configData)
        
        if (configData && configData.processPubSubMessages) {
            // Check if the assetId matches the currently selected assetId in Firestore

            console.log('configData.assetIds', configData.assetIds)
            console.log('assetId is ', assetId)

            if (configData.assetIds.includes(assetId)) {
                const packetData = {
                    bridgeId: eventData.value.bridgeId,
                    timestamp: new Date(),  // Current timestamp
                    rssi: eventData.value.RSSI,
                    rendered:false,
                    uuid:uuidv4()
                };
                console.log('adding packet data to packets subcollection',packetData);
                await configRef.collection(assetId).add(packetData);
            }
        }

    } catch (error) {
        console.error('Error processing event', error);
    }
};
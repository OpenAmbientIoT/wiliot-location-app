/**
 * Asset Event Processing in Serverless Functions
 *
 * This script is designed to be deployed as a Serverless Function. It processes incoming
 * events, typically received from a Messaging Queue (AWS SNS or GCP PubSub) topic, and updates Firestore documents based on the
 * event data. The script focuses on handling asset-related data, specifically mapping tag IDs to
 * asset IDs and bridge IDs to points of interest (POIs).
 *
 * Key Operations:
 * - Parses incoming Queue messages to extract event data.
 * - Retrieves asset IDs from a 'tag-asset-mapping' collection in Firestore based on the tag ID in the event.
 * - Retrieves POI IDs from a 'bridge-mapping-details-boutique' collection based on the bridge ID in the event.
 * - Updates or creates documents in the 'assets' collection with the new data from the event.
 *
 * Error Handling:
 * - The script includes error handling to manage issues in data retrieval or processing.
 * - Logs errors to the console for debugging and monitoring purposes.
 *
 * Environment Setup:
 * - The script requires the Firebase Admin SDK for Firestore and Cloud Functions SDK.
 * - Firestore database is initialized for data operations.
 *
 * Note:
 * - The script assumes a specific Firestore data structure and is tailored to handle events
 *   with specific data fields (tagId, bridgeId, TEMP, RSSI).
 * - Proper configuration of Firestore collections and document structure is crucial for the
 *   correct operation of this function.
 */

const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const DBCollection = 'assets-boutique';

exports.processEvent = async (event, context) => {
    try {
        // Parse the Pub/Sub message data
        const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString());
        
        // getting stored assetId from tagId
        let assetId = null
        await db.runTransaction( async (transaction) => {
            const docRef = db.collection("tag-asset-mapping-boutique").doc(eventData.tagId);
            const documentSnapshot = await transaction.get(docRef);

            if (documentSnapshot.exists) {
                assetId = documentSnapshot.data().assetId
            } else {
                console.error("No mapping found for tagId: " + eventData.tagId)
                throw new Error("No mapping found for tagId: " + eventData.tagId)
            }
        });

        // getting stored poiId from bridgeId 
        let poiId = null
        await db.runTransaction(async (transaction) => {
            if (eventData.hasOwnProperty('bridgeId') || 
                (eventData.hasOwnProperty('value') && eventData.value.hasOwnProperty('bridgeId'))) {
                    let bridgeId = null
                    if (eventData.hasOwnProperty('bridgeId')) {
                        bridgeId = eventData.bridgeId;
                    } else {
                        bridgeId = eventData.value.bridgeId;
                    }


                    const docRef = db.collection("bridge-mapping-details-boutique").doc(bridgeId);
        
                    const documentSnapshot = await transaction.get(docRef);
        
                    if (documentSnapshot.exists) {
                        poiId = documentSnapshot.data().zoneId
                    }
                    else {
                        console.error("No poi mapping found for bridgeId: " + bridgeId)
                        throw new Error("No poi mapping found for bridgeId: " + bridgeId)
                    }
            }
            else {
                console.error("No bridgeId found in event data")
                throw new Error("No bridgeId found in event data")
            }
        });


        await db.runTransaction(async (transaction) => {
            const assetDocRef = db.collection(DBCollection).doc(assetId);
            const documentSnapshot = await transaction.get(assetDocRef);

            if (!documentSnapshot.exists) {
                console.log(`No document found for asset ${assetId}, creating new one.`);
                transaction.set(assetDocRef, {
                    id: assetId,
                    name: assetId,
                    poiIdPacket: poiId,
                    temperature: eventData.value.TEMP,
                    rssi: eventData.value.RSSI,
                    bridgeId: eventData.value.bridgeId,
                    lastModifiedTimestamp: new Date(),  // The time when this document is created
                });
            } else {
                // document exists, always update it
                transaction.update(assetDocRef, {
                    poiIdPacket: poiId, // poiid/zoneid from packets
                    temperature: eventData.value.TEMP,
                    rssi: eventData.value.RSSI,
                    bridgeId: eventData.value.bridgeId,
                    lastModifiedTimestamp: new Date(),  // The time when this document is updated
                });
            };


        });

    } catch (error) {
        console.error('Error processing event', error);
    }
};


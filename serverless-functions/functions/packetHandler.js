const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const DBCollection = 'assets';

exports.processEvent = async (event, context) => {
    try {
        // Parse the Pub/Sub message data
        const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString());
        
        // getting stored assetId from tagId
        let assetId = null
        await db.runTransaction( async (transaction) => {
            const docRef = db.collection("tag-asset-mapping").doc(eventData.tagId);
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


                    const docRef = db.collection("bridge-mapping-details-all").doc(bridgeId);
        
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


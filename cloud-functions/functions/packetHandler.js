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

        // function hasPacketRateKeys(jsonObj) {
        //     // Check if it's an object and contains only two keys
        //     if (typeof jsonObj === 'object' && Object.keys(jsonObj).length === 2) {
        //         return ('tagId' in jsonObj && 'packetRate' in jsonObj);
        //     }
        //     return false;
        // }
        // if (hasPacketRateKeys(eventData)) {
        //     //update packet rate in firebase
        //     await db.runTransaction(async (transaction) => {
        //         const assetDocRef = db.collection(DBCollection).doc(assetId);
        //         const documentSnapshot = await transaction.get(assetDocRef);
        //         if (documentSnapshot.exists) {
        //             transaction.update(assetDocRef, {
        //                 packetRate: eventData.packetRate,
        //                 // lastModifiedTimestamp: new Date(),  // The time when this document is updated
        //             });
        //         }
        //     });
        //     return
        // }

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
                    // const docRef2 = db.collection("bridge-mapping-details-2").doc(bridgeId);
        
                    const documentSnapshot = await transaction.get(docRef);
                    // const documentSnapshot2 = await transaction.get(docRef2);
        
                    if (documentSnapshot.exists) {
                        poiId = documentSnapshot.data().zoneId
                    }
                    // else if (documentSnapshot2.exists) {
                    //     poiId = documentSnapshot2.data().zoneId
                    // }
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
                    poiId: poiId,
                    poiIdPacket: poiId,
                    temperature: eventData.value.TEMP,
                    rssi: eventData.value.RSSI,
                    bridgeId: eventData.value.bridgeId,
                    // packetRate: eventData.packetRate,
                    lastModifiedTimestamp: new Date(),  // The time when this document is created
                });
            } else {
                // document exists, always update it
                transaction.update(assetDocRef, {
                    poiId: poiId,
                    poiIdPacket: poiId,
                    temperature: eventData.value.TEMP,
                    rssi: eventData.value.RSSI,
                    bridgeId: eventData.value.bridgeId,
                    // packetRate: eventData.packetRate,
                    lastModifiedTimestamp: new Date(),  // The time when this document is updated
                });
            };


        });

        // pushing to other assetId
        // await db.runTransaction(async (transaction) => {
        //     const assetDocRef2 = db.collection(DBCollection).doc("coffee_cup_1669671577");
        //     const documentSnapshot2 = await transaction.get(assetDocRef2);

        //     if (!documentSnapshot2.exists) {
        //         console.log(`No document found for asset ${"coffee_cup_1669671577"}, creating new one.`);
        //         transaction.set(assetDocRef2, {
        //             id: assetId,
        //             poiId: poiId,
        //             temperature: eventData.value.TEMP,
        //             rssi: eventData.value.RSSI,
        //             bridgeId: eventData.value.bridgeId,
        //             packetRate: eventData.packetRate,
        //             lastModifiedTimestamp: new Date(),  // The time when this document is created
        //         });
        //     } else {
        //         // document exists, always update it
        //         transaction.update(assetDocRef2, {
        //             poiId: poiId,
        //             temperature: eventData.value.TEMP,
        //             rssi: eventData.value.RSSI,
        //             bridgeId: eventData.value.bridgeId,
        //             packetRate: eventData.packetRate,
        //             lastModifiedTimestamp: new Date(),  // The time when this document is updated
        //         });
        //     };
        // });
    } catch (error) {
        console.error('Error processing event', error);
    }
};


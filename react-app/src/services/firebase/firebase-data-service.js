import {addDoc, collection, deleteDoc, getDoc, getDocs, query, where} from '@firebase/firestore';
import {firebaseApp, firestore} from './firebaseConfig';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";

import {doc, onSnapshot, setDoc, updateDoc} from 'firebase/firestore';

const storage = getStorage(firebaseApp);


export const fetchLocations = async () => {
    const locationsSnapshot = await getDocs(collection(firestore, 'locations-boutique'));
    return locationsSnapshot.docs.map((doc) => doc.data());
};

export const fetchZoneCategory = async () => {
    const ZCSnapshot = await getDocs(collection(firestore, 'zone-category-mapping-boutique'));
    return ZCSnapshot.docs.map((doc) => doc.data());
};

export const fetchZones = async (locationId) => {
    const zonesSnapshot = await getDocs(collection(firestore, 'bridge-mapping-details-boutique'));
    const data = zonesSnapshot.docs
        .map((doc) => doc.data())
        .filter((zone) => zone.locationId === locationId);
    return data;
};

export const fetchZonesFromZoneMappingDetails = async (locationId) => {
    const zonesSnapshot = await getDocs(collection(firestore, 'zone-mapping-details-boutique'));
    const data = zonesSnapshot.docs
        .map((doc) => doc.data())
        .filter((zone) => zone.locationId === locationId && zone.zoneId !== '' && zone.zoneId !== null);
    return data;
};

export const fetchAssets = async () => {
    const assetsSnapshot = await getDocs(collection(firestore, 'assets-boutique'));
    return assetsSnapshot.docs.map((doc) => doc.data());
};

export const fetchCategories = async () => {
    const categoriesSnapshot = await getDocs(collection(firestore, 'categories-boutique'));
    return categoriesSnapshot.docs.map((doc) => doc.data());
};


export const getZoneMappingByLocationId = async (locationId) => {
    const zoneMappingSnapshot = await getDocs(query(collection(firestore, 'zone-mapping-boutique'), where('locationId', '==', locationId)));
    if (!zoneMappingSnapshot.empty) {
        const [zoneMappingDoc] = zoneMappingSnapshot.docs;
        return {id: zoneMappingDoc.id, ...zoneMappingDoc.data()};
    }
    return null;
};

export const uploadImageToStorage = async (imageFile) => {
    const storageRef = ref(storage, `zone-mapping-images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            null,
            (error) => {
                console.error('Error uploading image: ', error);
                reject(error);
            },
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
            }
        );
    });
};

export const logIssue = async (asset, issueDescription, issueImage) => {
    const {
        ownerId,
        location,
        zoneId,
        zoneName,
        categoryId,
        categoryName,
        id: assetId,
        name: assetName,
    } = asset;


    console.log('asset: ', asset)
    const issue = {
        ownerId: ownerId ?? '',
        location: location ?? '',
        zoneId: zoneId ?? '',
        zoneName: zoneName ?? '',
        categoryId: categoryId ?? '',
        categoryName: categoryName ?? '',
        assetId: assetId ?? '',
        assetName: assetName ?? '',
        issueDescription: issueDescription ?? '',
        loggedTime: new Date(),
    };

    console.log('issue: ', issue);

    if (issueImage) {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`issues/${assetId}_${Date.now()}`);
        await imageRef.put(issueImage);
        const imageURL = await imageRef.getDownloadURL();
        issue.imageURL = imageURL ?? '';
    }

    const reportingCollection = collection(firestore, 'reporting');

    const reportingQuery = await getDocs(query(reportingCollection, where('assetId', '==', assetId)));

    if (reportingQuery.empty) {
        await addDoc(reportingCollection, issue);
    } else {
        console.log('Issue already exists for this asset.');
    }
};


export const fetchIssuesLog = async () => {
    const issuesQuery = query(collection(firestore, 'reporting'));

    const issuesSnapshot = await getDocs(issuesQuery);

    const issuesData = issuesSnapshot.docs.map((doc) => {
        const data = doc.data();
        const {id} = doc;
        const loggedTime = new Date(data.loggedTime.seconds * 1000).toLocaleString();

        return {
            id,
            assetId: data.assetId ?? '',
            assetName: data.assetName ?? '',
            categoryId: data.categoryId ?? '',
            categoryName: data.categoryName ?? '',
            imageUrl: data.imageUrl ?? '',
            issueDescription: data.issueDescription ?? '',
            locationId: data.locationId ?? '',
            locationName: data.locationName ?? '',
            loggedTime,
            ownerId: data.ownerId ?? '',
            reporterId: data.reporterId ?? '',
            reporterName: data.reporterName ?? '',
            status: data.status ?? '',
            zoneId: data.zoneId ?? '',
            zoneName: data.zoneName ?? '',
        };
    });

    return issuesData;
};


export const subscribeToPinLocations = (updateFn) => {
    const pinLocationsRef = collection(firestore, 'pinLocation-sandbox');

    // The onSnapshot function returns an unsubscribe function
    const unsubscribe = onSnapshot(pinLocationsRef, snapshot => {
        const data = snapshot.docs.map((doc) => doc.data());
        updateFn(data);
    });

    return unsubscribe;
};


// Function to add a new pin location
// export const addPinLocation = async (pin) => {
//     await addDoc(collection(firestore, 'pinLocation-sandbox'), pin);
// };


export const addPinLocation = async (pin) => {
    await addDoc(collection(firestore, 'pinLocation-sandbox'), pin);
    // await manageSizeOfPinLocations();
};

export const clearAllPinLocations = async () => {
    const pinSnapshot = await getDocs(collection(firestore, 'pinLocation-sandbox'));
    const deletePromises = pinSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    console.log('clearing all pin locations...')
    return Promise.all(deletePromises);
};


export const subscribeToBucketSizeChanges = (callback) => {
    const configRef = doc(firestore, 'appConfig', 'settings');
    return onSnapshot(configRef, (snapshot) => {
        const data = snapshot.data();
        callback(data ? data.bucketSize : 10);  // default value is 10
    });
};


let MAX_SIZE = 100;  // default value

// Subscribe to bucket size changes and update the MAX_SIZE value dynamically
const unsubscribeFromBucketSize = subscribeToBucketSizeChanges((bucketSize) => {
    MAX_SIZE = bucketSize;
});

export const getBucketSize = async () => {
    try {
        const configRef = doc(firestore, 'appConfig', 'settings');
        const configSnapshot = await getDoc(configRef); // Changed from getDocs to getDoc

        if (configSnapshot.exists) {
            return configSnapshot.data().bucketSize || 10;  // return default value of 10 if not set
        }
        return 10; // default bucket size
    } catch (error) {
        console.error("Error fetching the bucket size:", error);
        return 10;  // default value in case of an error
    }
};

// Function to set the bucket size in Firebase
export const setBucketSize = async (bucketSize) => {
    const configRef = doc(firestore, 'appConfig', 'settings');
    return await setDoc(configRef, {bucketSize}, {merge: true}); // use merge to update only the bucketSize and not overwrite other fields
};


export const fetchTestAssets = async () => {
    const assetsSnapshot = await getDocs(collection(firestore, 'assets-boutique'));
    return assetsSnapshot.docs.map((doc) => doc.data());
};


export const subscribeToAssetsChanges = (callback) => {
    const assetsCollectionRef = collection(firestore, 'assets-boutique');
    const unsubscribe = onSnapshot(assetsCollectionRef, snapshot => {
        const fetchedAssets = snapshot.docs.map((doc) => doc.data());
        callback(fetchedAssets);
    });

    // Return the unsubscribe function so you can stop listening to changes when needed
    return unsubscribe;
};


export const deleteBridgeMappingDetails = async () => {
    const bridgeMappingCollection = collection(firestore, 'bridge-mapping-details-boutique');

    // Query to get all docs excluding ones with locationName = FTW2
    const q = query(bridgeMappingCollection, where("locationName", "!=", "FTW2"));

    const snapshot = await getDocs(q);

    const batch = firestore.batch();

    snapshot.docs.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
    });

    // Commit the batch
    await batch.commit();
};

export const updateAssetIdInWavelet = async (newAssetId) => {
    const waveletRef = doc(firestore, 'wavelet', 'selectedAsset');

    // Fetch the current assetId from Firestore
    const waveletDoc = await getDoc(waveletRef);
    const currentAssetId = waveletDoc.data().assetId;

    // Check if the current assetId is different from the newAssetId
    if (currentAssetId !== newAssetId) {
        console.log('updating assetId in wavelet: ', newAssetId);
        return await updateDoc(waveletRef, {assetId: newAssetId});
    } else {
        console.log('assetId is the same, not updating.');
    }
};

const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

export const updateAssetIdsInWavelet = async (newAssetIds) => {
    const waveletRef = doc(firestore, 'wavelet', 'selectedAsset');

    // Fetch the current assetIds from Firestore
    const waveletDoc = await getDoc(waveletRef);
    const currentAssetIds = waveletDoc.data().assetIds;

    // Check if the current assetIds is different from the newAssetIds
    if (!arraysEqual(currentAssetIds, newAssetIds)) {
        console.log('updating assetIds in wavelet: ', newAssetIds);
        return await updateDoc(waveletRef, {assetIds: newAssetIds});
    } else {
        console.log('assetIds are the same, not updating.');
    }
};

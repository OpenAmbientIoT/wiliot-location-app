import {subscribeToAssetsChanges} from "../../../../services/firebase/firebase-data-service";
import {useEffect, useState} from "react";

const useZoneAssetsSubscription = () => {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToAssetsChanges((newAssets) => {
            setAssets(newAssets);
        });
        return () => unsubscribe();
    }, []);

    return assets;
};

export default useZoneAssetsSubscription;
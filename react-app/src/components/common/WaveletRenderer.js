import React, {useEffect, useMemo, useRef, useState} from 'react';
import {firestore} from '../../services/firebase/firebaseConfig';
import './Wavelet.css';

const BATCH_SIZE = 500;

const calculatePosition = (x, y, width, height) => {
    const posX = Math.min(Math.max(x, 7), width - 7);
    const posY = Math.min(Math.max(y, 9), height - 9);
    return {posX, posY};
};

const WaveletRenderer = ({zones, width, height}) => {
    const [packets, setPackets] = useState([]);
    const processedUUIDs = useRef(new Set());
    const unsubscribeFromSubcollection = useRef(null);


    const zoneMap = useMemo(() => {
        return zones.reduce((acc, zone) => {
            acc[zone.id] = zone;
            return acc;
        }, {});
    }, [zones]);


    // Subscribe to the selectedAsset document to get the assetIds
    // This is Firebase's way of subscribing to a collection
    useEffect(() => {
        const selectedAssetRef = firestore.collection('wavelet-boutique').doc('selectedAsset');

        // Array to store all unsubscribe functions for each assetId
        const unsubscribes = [];

        const unsubscribeFromSelectedAsset = selectedAssetRef.onSnapshot(doc => {
            const assetIds = doc.data().assetIds || [];

            // Unsubscribe from the previous listeners for all assetIds
            unsubscribes.forEach(unsub => unsub());

            assetIds.forEach(assetId => {
                const unsubscribe = firestore.collection('wavelet-boutique')
                    .doc('selectedAsset')
                    .collection(assetId)
                    .where('rendered', '==', false)
                    .onSnapshot(snapshot => {
                        if (!snapshot.empty) {
                            let newPackets = [];
                            let batch = firestore.batch();

                            snapshot.docs.slice(0, BATCH_SIZE).forEach(doc => {
                                const data = doc.data();
                                if (processedUUIDs.current.has(data.uuid)) {
                                    console.log("Found duplicate UUID:", data.uuid);
                                } else {
                                    processedUUIDs.current.add(data.uuid);
                                    newPackets.push(data);
                                    const packetRef = firestore.collection('wavelet-boutique')
                                        .doc('selectedAsset')
                                        .collection(assetId)
                                        .doc(doc.id);
                                    batch.update(packetRef, {rendered: true});
                                }
                            });

                            batch.commit().then(() => {
                                setPackets(prevPackets => [...prevPackets, ...newPackets]);
                            }).catch(error => {
                                console.error("Error committing batch:", error);
                            });
                        }
                    });
                unsubscribes.push(unsubscribe);
            });
        });

        return () => {
            // Clean up all listeners
            unsubscribes.forEach(unsub => unsub());
            unsubscribeFromSelectedAsset();
        };
    }, []);


    useEffect(() => {
        if (packets.length > 0) {
            const timer = setTimeout(() => {
                setPackets([]);
            }, 2000);  // clear after 5 seconds

            return () => {
                clearTimeout(timer);
            };
        }
    }, [packets]);

    console.log('Wavelet Rendered', packets);

    return (
        <div style={{position: 'absolute', width: `${width}px`, height: `${height}px`, overflow: 'hidden'}}>
            {packets.map(packet => {
                const zone = zoneMap[packet.bridgeId];
                if (zone) {
                    const {posX, posY} = calculatePosition(zone.x, zone.y, width, height);
                    const circleSize = Math.pow(700 / packet.rssi, 2);
                    const textSize = packet.rssi / 5;
                    const textBoxWidth = 200;
                    const textBoxHeight = 100;

                    return (
                        <svg
                            // key={packet.timestamp+packet.rssi}
                            key={`packet-${packet.uuid}`}
                            width="14px"
                            height="18px"
                            style={{
                                position: 'absolute',
                                top: posY,
                                left: posX,
                                zIndex: 2,
                                overflow: 'visible'
                            }}>
                            <circle className="wave" cx="20" cy="20" r={circleSize} fill="none" stroke="blue"
                                    strokeWidth="1"/>

                            <rect
                                x={20 + 100 + 10} // circle's centerX + circle's radius + some margin
                                y={20 - textBoxHeight / 2} // to vertically center the box relative to the circle
                                width={textBoxWidth}
                                height={textBoxHeight}
                                fill="white"
                                stroke="black"
                                className="fadeWithWave"
                            />
                            <text
                                x={20 + 100 + 10 + textBoxWidth / 2} // centering the text inside the rectangle
                                y={20 - textSize / 2} // adjust this to make sure both lines of text are centered vertically
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{
                                    fontSize: `${textSize}px`
                                }}
                                className="fadeWithWave"
                            >
                                <tspan x={20 + 100 + 10 + textBoxWidth / 2} dy="0">
                                    {`BridgeId: ${packet.bridgeId}`}
                                </tspan>
                                <tspan x={20 + 100 + 10 + textBoxWidth / 2} dy={textSize}>
                                    {`RSSI: -${packet.rssi}`}
                                </tspan>
                            </text>
                        </svg>
                    );
                }
                return null;
            })}
        </div>
    );
};


export default WaveletRenderer;

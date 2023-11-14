// import React from "react";
// import extractZoneName from "./utils/ZoneNameExtractor";

// const HighlightedZonePin = ({ width, height, zone, assetNamesForZone }) => {
//     const centerX = zone.rect.x + (zone.rect.width / 2) + 60;
//     const centerY = zone.rect.y + (zone.rect.height / 2);
//
//     console.log("zone", zone)
//     console.error("assetNamesForZone", assetNamesForZone)
//
//     return (
//         <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
//             {/* Pin body */}
//             <path
//                 d={`M ${centerX} ${centerY + 80} Q ${centerX} ${centerY - 40} ${centerX + 70} ${centerY - 40} Q ${centerX} ${centerY - 200} ${centerX - 70} ${centerY - 40} Q ${centerX} ${centerY - 40} ${centerX} ${centerY + 80} `}
//                 fill="rgba(56, 184, 185, 0.7)"
//             />
//
//             {/* Zone name inside the pin */}
//             <text
//                 x={centerX}
//                 y={centerY - 60}
//                 fill="white"
//                 fontSize="20"
//                 fontWeight="bold"
//                 textAnchor="middle"
//                 alignmentBaseline="middle"
//             >
//                 {extractZoneName(zone.name)}
//             </text>
//
//             {/* Asset names below the pin */}
//             <rect
//                 x={centerX - 75}
//                 y={centerY + 90}
//                 width={150}
//                 height={60}
//                 fill="#38b8b9"
//             />
//             <text
//                 x={centerX}
//                 y={centerY + 130}
//                 fill="white"
//                 fontSize="24"
//                 fontWeight="bold"
//                 textAnchor="middle"
//                 alignmentBaseline="middle"
//             >
//                 {assetNamesForZone.join(', ')}
//             </text>
//         </svg>
//     );
// };

import React from "react";
import {selectGradient} from "../utils/gradients";

const HighlightedZonePin = ({width, height, zone, assetNamesForZone, assetTempForZone}) => {
    const centerX = zone.rect.x + (zone.rect.width / 2) + 10;
    const centerY = zone.rect.y + (zone.rect.height / 2);

    const color = selectGradient(assetTempForZone[0]);

    // console.log('temp', assetTempForZone[0])

    // const rgbaMatch = color[".7"].match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d?(?:\.\d+)?)\)$/);
    // const rgb = rgbaMatch ? `rgb(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]})` : '#000';
    // const rgb = rgbaMatch ? `rgb(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]})` : '#000';

    const pinStyle = {
        position: 'absolute',
        top: centerY - 95,
        left: centerX - 70,
        width: 140,
        height: 140,
        borderRadius: '50%',
        backgroundColor: 'rgba(56, 184, 185, 0.7)', // Turquoise with transparency
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const textStyle = {
        position: 'absolute',
        top: centerY + 50,
        left: centerX - 70,
        width: 140,
        textAlign: 'center',
        backgroundColor: '#38b8b9',
        padding: 5
    };

    // console.log('HighlightedZonePin Rendered')

    return (
        <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
            <circle cx={centerX} cy={centerY - 50} r="45" fill="red" fillOpacity="0.8"/>
            <path d={`M${centerX - 40} ${centerY - 25} L${centerX} ${centerY + 25} L${centerX + 40} ${centerY - 25} Z`}
                  fill="red" fillOpacity="0.8"/>

            <text x={centerX} y={centerY - 70} fill="black" fontSize="12" fontWeight="bold" textAnchor="middle"
                  alignmentBaseline="middle">
                {/*{extractZoneName(zone.name)}*/}
            </text>
            '
            <text
                x={centerX}
                y={centerY - 30}
                fill="black"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
            >
                {assetNamesForZone.join(', ')}
            </text>


            {/*<rect*/}
            {/*                    x={centerX-75}*/}
            {/*                    y={centerY + 70}*/}
            {/*                    width={150}*/}
            {/*                    height={60}*/}
            {/*                    fill="red"*/}
            {/*                />*/}


        </svg>
    );
};

export default HighlightedZonePin;

// export default HighlightedZonePin;

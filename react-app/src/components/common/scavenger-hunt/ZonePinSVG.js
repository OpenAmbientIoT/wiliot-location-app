import extractZoneName from "./utils/ZoneNameExtractor";
import React from "react";

const ZonePinSVG = ({zone, width, height, assetCount}) => {
    const centerX = zone.rect.x + (zone.rect.width / 2) + 40;
    const centerY = zone.rect.y + (zone.rect.height / 2);
    const radius = '100'//Math.min(zone.rect.width, zone.rect.height) / 2 * 4.2;

    const fillColor = "#00b185";

    return (
        <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
            <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={fillColor}
                fillOpacity={0.4}  // Semi-transparent
                strokeWidth={2}
                style={{pointerEvents: 'all'}}
            />
            <text
                x={centerX}
                y={centerY - 25}
                fill="white"
                fontSize="13"
                fontWeight="500"
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}
            >
                {extractZoneName(zone.name)}
            </text>

            <text
                x={centerX}
                y={centerY}
                fill="white"
                fontSize="20"
                fontWeight="500"
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}
            >
                {assetCount}
            </text>
            <text
                x={centerX}
                y={centerY + 25}
                fill="white"
                fontSize="20"
                fontWeight="500"
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}
            >
                Assets
            </text>
        </svg>
    );
};

export default ZonePinSVG;
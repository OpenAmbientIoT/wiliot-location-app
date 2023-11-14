import React from 'react';

const ImagePlaceholder = ({children}) => {
    return (
        <div
            className="image-upload-placeholder"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed black',
                borderRadius: '5px',
                height: '800px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {children ? children : (
                <span
                    className="image-upload-placeholder-text"
                    style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                >
                    X
                </span>
            )}
        </div>
    );
};

export default ImagePlaceholder;
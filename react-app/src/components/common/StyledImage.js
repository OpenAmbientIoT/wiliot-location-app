import React, {useEffect} from 'react';

const StyledImage = ({imgRef, src, onLoad}) => {
    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.src = src;
        }
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={src}
            alt="Floor Plan"
            onLoad={onLoad}
            style={{
                position: 'relative',
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                userSelect: 'none',
            }}
        />
    );
};

export default StyledImage;

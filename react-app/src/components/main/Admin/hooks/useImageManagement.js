import {useRef, useState} from 'react';

const useImageManagement = () => {
    const [image, setImage] = useState(null);
    const imgRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleImageUpload = (e) => {
        const reader = new FileReader();

        const file = e.target.files[0];

        reader.onload = () => {
            setImage(reader.result);
            setUploadedImage(reader.result);
        };
        reader.readAsDataURL(file);

        setImageFile(file); // Store the file object in the state
    };

    return {
        image,
        setImage,
        imgRef,
        imageDimensions,
        setImageDimensions,
        imageFile,
        setImageFile,
        handleImageUpload
    };
};

export default useImageManagement;
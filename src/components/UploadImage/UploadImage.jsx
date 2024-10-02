import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useParams } from 'react-router-dom';
import { Button, Tooltip, IconButton, Typography, Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const UploadImage = () => {
    const { id } = useParams(); 
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const storageRef = ref(storage, `events/${id}/images`);
            const imageList = await listAll(storageRef);
            const urls = await Promise.all(imageList.items.map(item => getDownloadURL(item)));
            setUploadedImages(urls);
        };

        fetchImages();
    }, [id]);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!image) return;
        const storageRef = ref(storage, `events/${id}/images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error('Upload error: ', error);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUrl(downloadURL);
                    setUploadedImages(prev => [...prev, downloadURL]); 
                });
            }
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <input type="file" onChange={handleChange} style={{ marginBottom: '20px' }} />
            <Tooltip title="Upload Image" arrow>
                <IconButton 
                    onClick={handleUpload} 
                    color="primary" 
                    disabled={!image}
                    sx={{ marginBottom: '20px' }}
                >
                    <UploadIcon />
                </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ margin: '10px 0' }}>
                Upload Progress: {Math.round(progress)}%
            </Typography>
            <progress value={progress} max="100" style={{ width: '100%', height: '10px' }} />
            {url && <img src={url} alt="Event" style={{ width: '200px', marginTop: '20px' }} />}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                {uploadedImages.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Event ${id}`} style={{ width: '100px', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} />
                ))}
            </Box>
        </Box>
    );
};

export default UploadImage;

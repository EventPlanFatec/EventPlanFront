import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Typography, Box } from '@mui/material';

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
        <Box sx={{ p: 2 }}>
            <input type="file" onChange={handleChange} />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpload}
                disabled={!image}
                sx={{ mt: 2 }}
            >
                Upload
            </Button>
            {progress > 0 && (
                <Box sx={{ mt: 2 }}>
                    <CircularProgress variant="determinate" value={progress} />
                    <Typography variant="body2">{`${Math.round(progress)}%`}</Typography>
                </Box>
            )}
            {url && <img src={url} alt="Event" style={{ width: '100%', marginTop: '16px' }} />}
            <div style={{ marginTop: '16px' }}>
                {uploadedImages.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Event ${id}`} style={{ width: '100px', margin: '10px' }} />
                ))}
            </div>
        </Box>
    );
};

export default UploadImage;

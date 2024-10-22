import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Typography, Box, Input } from '@mui/material';

const UploadImage = () => {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const storageRef = ref(storage, `events/${id}/images`);
            try {
                const imageList = await listAll(storageRef);
                const urls = await Promise.all(imageList.items.map(item => getDownloadURL(item)));
                setUploadedImages(urls);
            } catch (error) {
                console.error("Error fetching images: ", error);
            }
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
                console.error("Upload error: ", error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setUploadedImages(prev => [...prev, downloadURL]);
                } catch (error) {
                    console.error("Error fetching download URL: ", error);
                }
            }
        );
    };

    const styles = {
        uploadContainer: {
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        uploadTitle: {
            marginBottom: '32px',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#333',
        },
        fileInputWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#f7f7f7',
            borderRadius: '8px',
        },
        fileButton: {
            marginBottom: '20px',
            width: '100%',
            textTransform: 'none',
            borderColor: '#1976d2',
            color: '#1976d2',
            fontSize: '1.1rem',
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #1976d2',
        },
        uploadButton: {
            marginTop: '24px',
            width: '100%',
            textTransform: 'none',
            padding: '14px',
            fontSize: '1.1rem',
            borderRadius: '8px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
        },
        progressWrapper: {
            marginTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        imagesWrapper: {
            marginTop: '40px',
            width: '100%',
        },
        imageGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '16px',
            justifyItems: 'center',
        },
        imageThumbnail: {
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '2px solid #ddd',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
    };

    return (
        <Box sx={styles.uploadContainer}>
            <Typography variant="h5" sx={styles.uploadTitle}>
                Upload de Imagem para o Evento
            </Typography>
            
            <Box sx={styles.fileInputWrapper}>
                <Input
                    type="file"
                    onChange={handleChange}
                    sx={{ display: 'none'}} 
                    id="file-input" 
                />
                <label htmlFor="file-input">
                    <Button 
                        variant="outlined" 
                        component="span" 
                        sx={styles.fileButton}
                    >
                        Escolher Arquivo
                    </Button>
                </label>
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleUpload}
                    disabled={!image}
                    sx={styles.uploadButton}
                >
                    Upload
                </Button>
                
                {progress > 0 && (
                    <Box sx={styles.progressWrapper}>
                        <CircularProgress variant="determinate" value={progress} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {`${Math.round(progress)}%`}
                        </Typography>
                    </Box>
                )}
            </Box>

            {uploadedImages.length > 0 && (
                <Box sx={styles.imagesWrapper}>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                        Imagens Carregadas
                    </Typography>
                    <Box sx={styles.imageGrid}>
                        {uploadedImages.map((imgUrl, index) => (
                            <Box key={index} sx={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                                <img 
                                    src={imgUrl} 
                                    alt={`Event ${id}`} 
                                    style={styles.imageThumbnail}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default UploadImage;

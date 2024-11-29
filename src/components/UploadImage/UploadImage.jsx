import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
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

    return (
        <Box>
            <Typography variant="h5">
                Upload de Imagem para o Evento
            </Typography>
            
            <Box >
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
                        
                    >
                        Escolher Arquivo
                    </Button>
                </label>
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleUpload}
                    disabled={!image}
                >
                    Upload
                </Button>
                
                {progress > 0 && (
                    <Box>
                        <CircularProgress variant="determinate" value={progress} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {`${Math.round(progress)}%`}
                        </Typography>
                    </Box>
                )}
            </Box>

            {uploadedImages.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                        Imagens Carregadas
                    </Typography>
                    <Box>
                        {uploadedImages.map((imgUrl, index) => (
                            <Box key={index} sx={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                                <img 
                                    src={imgUrl} 
                                    alt={`Event ${id}`} 
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

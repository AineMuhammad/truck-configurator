import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Container, 
    CircularProgress,
    Alert,
    Fade
} from '@mui/material';
import { ViewInAr as ViewInArIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useSearchParams } from 'react-router-dom';
import { openAR } from '../utils/ARLinkGenerator';
import { AR_BASE_URLS } from '../utils/constants';

// Simple 3D model viewer component
function ModelViewer({ glbUrl }) {
    const [model, setModel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!glbUrl) return;

        // Import GLTFLoader dynamically
        import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
            const loader = new GLTFLoader();
            
            loader.load(
                glbUrl,
                (gltf) => {
                    setModel(gltf.scene);
                    setIsLoading(false);
                },
                (progress) => {
                    console.log('Loading progress:', (progress.loaded / progress.total) * 100);
                },
                (error) => {
                    console.error('Error loading model:', error);
                    setError('Failed to load 3D model');
                    setIsLoading(false);
                }
            );
        });
    }, [glbUrl]);

    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'white'
            }}>
                <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Loading 3D Model...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'white'
            }}>
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Canvas 
            style={{ 
                height: '100vh', 
                width: '100vw',
                background: 'white'
            }}
            camera={{ position: [0, 0, 25], fov: 20 }}
        >
            <Environment preset="studio" />
            {model && <primitive object={model} />}
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
                dampingFactor={0.05}
                enableDamping={true}
            />
        </Canvas>
    );
}

export default function ARViewer() {
    const [searchParams] = useSearchParams();
    const [isPhoneDevice, setIsPhoneDevice] = useState(false);
    
    // Get hash parameter from URL and construct model URLs
    const configHash = searchParams.get('hash');
    const glbUrl = configHash ? `${AR_BASE_URLS.GLB}/${configHash}.glb` : null;
    const usdzUrl = configHash ? `${AR_BASE_URLS.USDZ}/${configHash}.usdz` : null;

    useEffect(() => {
        // Detect if it's a phone device
        setIsPhoneDevice(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    const handleViewInAR = () => {
        if (!glbUrl && !usdzUrl) {
            alert('No AR model available');
            return;
        }
        
        openAR(glbUrl, usdzUrl);
    };

    if (!glbUrl && !usdzUrl) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'white'
            }}>
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    No model URL provided. Please scan the QR code from the main application.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            position: 'relative',
            height: '100vh',
            width: '100vw',
            background: 'white',
            overflow: 'hidden'
        }}>
            {/* Full-screen 3D Model Viewer */}
            {glbUrl && <ModelViewer glbUrl={glbUrl} />}

            {/* Floating AR Button */}
            <Fade in={isPhoneDevice} timeout={1000}>
                <Box sx={{
                    position: 'fixed',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000
                }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleViewInAR}
                        startIcon={<ViewInArIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            px: 4,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            minWidth: 200
                        }}
                    >
                        View in AR
                    </Button>
                </Box>
            </Fade>

            {/* Desktop Warning */}
            {!isPhoneDevice && (
                <Fade in={!isPhoneDevice} timeout={1000}>
                    <Box sx={{
                        position: 'fixed',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000
                    }}>
                        <Alert 
                            severity="info" 
                            sx={{ 
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            AR is only supported on mobile devices. Please open this page on your phone.
                        </Alert>
                    </Box>
                </Fade>
            )}

            {/* Configuration Hash (subtle) */}
            {configHash && (
                <Box sx={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 1000
                }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            opacity: 0.6,
                            background: 'rgba(255, 255, 255, 0.8)',
                            padding: '4px 8px',
                            borderRadius: 1,
                            fontSize: '0.75rem'
                        }}
                    >
                        Config: {configHash}
                    </Typography>
                </Box>
            )}
        </Box>
    );
} 
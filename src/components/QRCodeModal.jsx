import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Box, 
    Typography, 
    Paper,
    IconButton
} from '@mui/material';
import { 
    Close as CloseIcon
} from '@mui/icons-material';

export default function QRCodeModal({ open, onClose, glbUrl, usdzUrl, configHash }) {
    // Generate the mobile AR viewer URL
    const generateMobileARUrl = () => {
        const baseUrl = window.location.origin;
        const params = new URLSearchParams();
        if (configHash) params.append('hash', configHash);
        
        return `${baseUrl}/ar-viewer?${params.toString()}`;
    };

    const mobileARUrl = generateMobileARUrl();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mobileARUrl)}`;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: '#f5f5f5',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 3,
                pt: 3,
                px: 4,
                borderBottom: '1px solid #e0e0e0'
            }}>
                <Typography variant="h5" component="div" sx={{ 
                    fontWeight: 700,
                    color: '#1a1a1a',
                    letterSpacing: '-0.5px'
                }}>
                    View on your phone
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ 
                    color: '#666',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 4, pb: 3, px: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" color="#333" sx={{ 
                        mb: 1,
                        fontWeight: 500
                    }}>
                        Scan with your phone
                    </Typography>
                    <Typography variant="body2" color="#666" sx={{ 
                        lineHeight: 1.5
                    }}>
                        Point your camera at the QR code to open the AR experience
                    </Typography>
                </Box>

                {/* QR Code */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            background: '#ffffff',
                            border: '1px solid #e8e8e8',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}
                    >
                        <img 
                            src={qrCodeUrl} 
                            alt="QR Code for mobile AR viewer"
                            style={{ 
                                width: '220px', 
                                height: '220px',
                                display: 'block'
                            }}
                        />
                    </Paper>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
                    sx={{
                        backgroundColor: '#007bff',
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': {
                            backgroundColor: '#0056b3',
                            boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
                        }
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
} 
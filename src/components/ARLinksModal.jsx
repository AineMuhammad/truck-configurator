import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Box, 
    Typography, 
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    Close as CloseIcon,
    Android as AndroidIcon,
    Apple as AppleIcon,
    Language as WebIcon,
    QrCode as QrCodeIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';

export default function ARLinksModal({ open, onClose, arLinks, configHash }) {
    const handleCopyLink = (link, platform) => {
        navigator.clipboard.writeText(link).then(() => {
            // You could add a toast notification here
            console.log(`${platform} link copied to clipboard`);
        });
    };

    const handleOpenLink = (link) => {
        window.open(link, '_blank');
    };

    const handleOpenQRCode = (link) => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
        window.open(qrUrl, '_blank');
    };

    if (!arLinks) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
            }}>
                <Box>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        View in AR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Choose your platform to experience AR
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Chip 
                        label={`Config: ${configHash}`} 
                        variant="outlined" 
                        size="small"
                        sx={{ fontFamily: 'monospace' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Android AR Link */}
                    {arLinks.android && (
                        <Box sx={{
                            background: 'white',
                            borderRadius: 2,
                            p: 2,
                            border: '1px solid #e0e0e0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AndroidIcon sx={{ color: '#3ddc84', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Android
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Opens in Google Scene Viewer for AR experience
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleOpenLink(arLinks.android)}
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #3ddc84, #2bb673)',
                                        '&:hover': { background: 'linear-gradient(135deg, #2bb673, #1a9f5a)' }
                                    }}
                                >
                                    Open AR
                                </Button>
                                <Tooltip title="Copy link">
                                    <IconButton 
                                        onClick={() => handleCopyLink(arLinks.android, 'Android')}
                                        size="small"
                                    >
                                        <CopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Show QR Code">
                                    <IconButton 
                                        onClick={() => handleOpenQRCode(arLinks.android)}
                                        size="small"
                                    >
                                        <QrCodeIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}

                    {/* iOS AR Link */}
                    {arLinks.ios && (
                        <Box sx={{
                            background: 'white',
                            borderRadius: 2,
                            p: 2,
                            border: '1px solid #e0e0e0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AppleIcon sx={{ color: '#000', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    iOS
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Opens in Quick Look for AR experience on iPhone/iPad
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleOpenLink(arLinks.ios)}
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #000, #333)',
                                        '&:hover': { background: 'linear-gradient(135deg, #333, #555)' }
                                    }}
                                >
                                    Open AR
                                </Button>
                                <Tooltip title="Copy link">
                                    <IconButton 
                                        onClick={() => handleCopyLink(arLinks.ios, 'iOS')}
                                        size="small"
                                    >
                                        <CopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Show QR Code">
                                    <IconButton 
                                        onClick={() => handleOpenQRCode(arLinks.ios)}
                                        size="small"
                                    >
                                        <QrCodeIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}

                    {/* Universal AR Link */}
                    {arLinks.universal && (
                        <Box sx={{
                            background: 'white',
                            borderRadius: 2,
                            p: 2,
                            border: '1px solid #e0e0e0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <WebIcon sx={{ color: '#2196f3', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Universal
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Smart link that works on all platforms
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleOpenLink(arLinks.universal)}
                                    sx={{ 
                                        background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                                        '&:hover': { background: 'linear-gradient(135deg, #1976d2, #1565c0)' }
                                    }}
                                >
                                    Open AR
                                </Button>
                                <Tooltip title="Copy link">
                                    <IconButton 
                                        onClick={() => handleCopyLink(arLinks.universal, 'Universal')}
                                        size="small"
                                    >
                                        <CopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Show QR Code">
                                    <IconButton 
                                        onClick={() => handleOpenQRCode(arLinks.universal)}
                                        size="small"
                                    >
                                        <QrCodeIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box sx={{ mt: 3, p: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Tip:</strong> For the best AR experience, use the platform-specific links. 
                        The universal link will automatically detect your device and choose the appropriate AR viewer.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
} 
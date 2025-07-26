import React from 'react';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { 
    Fullscreen as FullscreenIcon, 
    FullscreenExit as FullscreenExitIcon, 
    Pause as PauseIcon, 
    PlayArrow as PlayArrowIcon,
    ViewInAr as ViewInArIcon
} from '@mui/icons-material';

export default function ActionBar({ 
    isAutoRotating, 
    onAutoRotateToggle, 
    isFullscreen, 
    onFullscreenToggle,
    onExportGLB,
    isARLoading = false
}) {
    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 1,
                bgcolor: 'white',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
            }}
        >
            <Tooltip title={isARLoading ? "Generating AR assets..." : "Generate AR Assets"}>
                <IconButton 
                    onClick={onExportGLB}
                    disabled={isARLoading}
                    sx={{ 
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                        '&:focus': {
                            outline: 'none'
                        },
                        '&:disabled': {
                            color: 'rgba(0, 0, 0, 0.38)',
                        }
                    }}
                >
                    {isARLoading ? (
                        <CircularProgress size={20} color="primary" />
                    ) : (
                        <ViewInArIcon />
                    )}
                </IconButton>
            </Tooltip>
            <IconButton 
                onClick={onAutoRotateToggle}
                sx={{ 
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '&:focus': {
                        outline: 'none'
                    }
                }}
            >
                {
                    isAutoRotating ? <PauseIcon /> : <PlayArrowIcon />
                }
            </IconButton>
            <IconButton 
                onClick={onFullscreenToggle}
                sx={{ 
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '&:focus': {
                        outline: 'none'
                    }
                }}
            >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
        </Box>
    );
} 
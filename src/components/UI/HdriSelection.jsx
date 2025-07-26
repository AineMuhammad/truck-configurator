import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore, Landscape } from '@mui/icons-material';
import useConfiguratorStore from '../../store/useConfiguratorStore';
import { hdriOptions } from '../../utils/constants';

export default function HdriSelection({ hdriOpen, onHdriToggle }) {
    const selectedHdri = useConfiguratorStore(state => state.selectedHdri);
    const setHdri = useConfiguratorStore(state => state.setHdri);

    const handleHdriChange = (hdriId) => {
        setHdri(hdriId);
    };

    return (
        <>
            <ListItemButton 
                onClick={onHdriToggle}
                sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    mb: 1,
                    color: '#ffffff',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.12)',
                    }
                }}
            >
                <ListItemIcon>
                    <Landscape sx={{ fontSize: 20, color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="Environment" />
                {hdriOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={hdriOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2, 
                        py: 3,
                        px: 2.5,
                    }}>
                        {hdriOptions.map((hdri) => (
                            <ListItem key={hdri.id} disablePadding sx={{ width: 'auto' }}>
                                <ListItemButton
                                    selected={selectedHdri === hdri.id}
                                    onClick={() => handleHdriChange(hdri.id)}
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 0,
                                        borderRadius: '6px',
                                        border: selectedHdri === hdri.id 
                                            ? '2px solid'
                                            : '2px solid transparent',
                                        borderColor: selectedHdri === hdri.id 
                                            ? 'primary.main'
                                            : 'transparent',
                                        width: 60,
                                        height: 60,
                                        minWidth: 60,
                                        position: 'relative',
                                        transition: 'all 0.2s ease',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            '& .hdri-name': {
                                                opacity: 1,
                                            }
                                        },
                                        '&.Mui-selected': {
                                            bgcolor: 'transparent',
                                            '&:hover': {
                                                bgcolor: 'transparent',
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={hdri.thumbnail}
                                        alt={hdri.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '6px',
                                            filter: selectedHdri === hdri.id 
                                                ? 'brightness(1.1)'
                                                : 'brightness(1)',
                                            transition: 'filter 0.2s ease'
                                        }}
                                    />
                                    <Typography 
                                        variant="caption" 
                                        className="hdri-name"
                                        sx={{ 
                                            position: 'absolute',
                                            bottom: -24,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            whiteSpace: 'nowrap',
                                            fontSize: '0.7rem',
                                            fontWeight: 400,
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            opacity: selectedHdri === hdri.id ? 1 : 0.7,
                                            transition: 'opacity 0.2s ease',
                                        }}
                                    >
                                        {hdri.name}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </Box>
                </List>
            </Collapse>
        </>
    );
}

HdriSelection.propTypes = {
    hdriOpen: PropTypes.bool.isRequired,
    onHdriToggle: PropTypes.func.isRequired,
}; 
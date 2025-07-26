import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
} from '@mui/material';
import {
    Palette as PaletteIcon,
    ExpandLess,
    ExpandMore,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { truckColors } from '../../utils/constants';

export default function ColorCustomization({ 
    colorOpen, 
    selectedColor, 
    onColorChange, 
    onResetColor 
}) {
    return (
        <>
            <ListItemButton 
                onClick={() => onColorChange(null)}
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
                    <PaletteIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Color Customization" />
                {colorOpen ? <ExpandLess sx={{ color: '#fff' }} /> : <ExpandMore sx={{ color: '#fff' }} />}
            </ListItemButton>
            <Collapse in={colorOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(4, 1fr)', 
                                gap: 1,
                                width: '100%'
                            }}>
                                {truckColors.map((color) => (
                                    <Button
                                        key={color.id}
                                        variant={selectedColor === color.hex ? "contained" : "outlined"}
                                        onClick={() => onColorChange(color.hex)}
                                        sx={{
                                            minWidth: 'auto',
                                            width: 40,
                                            height: 40,
                                            backgroundColor: color.hex,
                                            border: `2px solid ${selectedColor === color.hex ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'}`,
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: color.hex,
                                                border: '2px solid #ffffff',
                                                transform: 'scale(1.1)',
                                            },
                                            '&.MuiButton-contained': {
                                                backgroundColor: color.hex,
                                                border: '2px solid #ffffff',
                                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                                            }
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </Box>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={onResetColor}
                                fullWidth
                                sx={{
                                    color: '#ffffff',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: '#ffffff',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                Reset Color
                            </Button>
                        </Box>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
}

ColorCustomization.propTypes = {
    colorOpen: PropTypes.bool.isRequired,
    selectedColor: PropTypes.string.isRequired,
    onColorChange: PropTypes.func.isRequired,
    onResetColor: PropTypes.func.isRequired,
}; 
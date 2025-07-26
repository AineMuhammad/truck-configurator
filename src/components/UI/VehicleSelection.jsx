import React from 'react';
import PropTypes from 'prop-types';
import {
    Typography,
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    List,
    Collapse,
    ListItem,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    DirectionsCar as CarIcon,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';
import vehicleOptions from '../../data/vehicleOptions.json';

export default function VehicleSelection({ 
    selectedTruck,
    vehicleOpen,
    onVehicleToggle,
    selectedParts,
    onPartSelect
}) {
    const selectedTruckData = vehicleOptions.trucks.find(truck => truck.id === selectedTruck);
    
    // Group parts by category
    const partsByCategory = vehicleOptions.parts.reduce((acc, part) => {
        if (!acc[part.category]) {
            acc[part.category] = [];
        }
        acc[part.category].push(part);
        return acc;
    }, {});

    return (
        <>
            <ListItemButton 
                onClick={onVehicleToggle}
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
                    <CarIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Vehicle Customization" />
                {vehicleOpen ? <ExpandLess sx={{ color: '#fff' }} /> : <ExpandMore sx={{ color: '#fff' }} />}
            </ListItemButton>
            <Collapse in={vehicleOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem>
                        <Typography
                            sx={{ 
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: 'medium',
                                color: '#ffffff',
                                mb: 1,
                                background: 'rgba(255, 255, 255, 0.1)',
                                py: 2,
                                px: 3,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                            }}
                        >
                            {selectedTruckData ? selectedTruckData.name : 'No truck selected'}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                            {Object.entries(partsByCategory).map(([category, parts]) => (
                                <FormControl key={category} fullWidth>
                                    <InputLabel id={`${category}-label`}>{category}</InputLabel>
                                    <Select
                                        labelId={`${category}-label`}
                                        id={`${category}-select`}
                                        value={selectedParts[category] || 'default'}
                                        label={category}
                                        onChange={(event) => onPartSelect(event.target.value, category)}
                                        sx={{
                                            '& .MuiSelect-select': {
                                                py: 1
                                            }
                                        }}
                                    >
                                        <MenuItem value="default">Default</MenuItem>
                                        {parts.map(part => (
                                            <MenuItem key={part.id} value={part.id}>
                                                {part.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ))}
                        </Box>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
}

VehicleSelection.propTypes = {
    selectedTruck: PropTypes.string.isRequired,
    vehicleOpen: PropTypes.bool.isRequired,
    onVehicleToggle: PropTypes.func.isRequired,
    selectedParts: PropTypes.object.isRequired,
    onPartSelect: PropTypes.func.isRequired,
}; 
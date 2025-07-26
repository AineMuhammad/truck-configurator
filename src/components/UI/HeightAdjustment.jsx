import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
} from '@mui/material';
import {
    Height as HeightIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Refresh as RefreshIcon,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';

export default function HeightAdjustment({ 
    heightOpen, 
    currentHeight, 
    onHeightAdjustment, 
    onReset 
}) {
    return (
        <>
            <ListItemButton 
                onClick={() => onHeightAdjustment(null)} 
                sx={{ 
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                    }
                }}
            >
                <ListItemIcon>
                    <HeightIcon />
                </ListItemIcon>
                <ListItemText primary="Height Adjustment" />
                {heightOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={heightOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem>
                        <Paper 
                            sx={{ 
                                p: 2, 
                                width: '100%', 
                                bgcolor: 'primary.main',
                                color: 'white',
                                textAlign: 'center'
                            }}
                        >
                            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                {currentHeight} inches
                            </Typography>
                        </Paper>
                    </ListItem>
                    <ListItem>
                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => onHeightAdjustment(0.25)}
                                fullWidth
                            >
                                +0.25"
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<RemoveIcon />}
                                onClick={() => onHeightAdjustment(-0.25)}
                                fullWidth
                            >
                                -0.25"
                            </Button>
                        </Box>
                    </ListItem>
                    <ListItem>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={onReset}
                            fullWidth
                        >
                            Reset Height
                        </Button>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
}

HeightAdjustment.propTypes = {
    heightOpen: PropTypes.bool.isRequired,
    currentHeight: PropTypes.number.isRequired,
    onHeightAdjustment: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
}; 
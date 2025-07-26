import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { replaceTruckPart, resetTruckPart } from "../../utils/HelperFunctions";
import vehicleOptions from "../../data/vehicleOptions.json";
import useConfiguratorStore from "../../store/useConfiguratorStore";
import { DEFAULT_TRUCK_COLOR } from "../../utils/constants";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import ColorCustomization from "./ColorCustomization";
import VehicleSelection from "./VehicleSelection";
import HdriSelection from "./HdriSelection";

const drawerWidth = 300;

export default function UI({ sendMessage }) {
  const truckRef = useConfiguratorStore((state) => state.truckRef);
  const setTruckColor = useConfiguratorStore((state) => state.setTruckColor);
  const truckColor = useConfiguratorStore((state) => state.truckColor);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(true);
  const [hdriOpen, setHdriOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState("Truck");
  const [selectedParts, setSelectedParts] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const scene = useConfiguratorStore((state) => state.scene);

  // Initialize default parts when component mounts
  useEffect(() => {
    if (vehicleOptions && vehicleOptions.parts) {
      const defaultParts = {};
      vehicleOptions.parts.forEach((part) => {
        if (!defaultParts[part.category]) {
          defaultParts[part.category] = "default";
        }
      });
      setSelectedParts(defaultParts);
    }
  }, []);

  const handleColorChange = (color) => {
    if (color === null) {
      setColorOpen(!colorOpen);
      return;
    }
    setTruckColor(color);
    if (sendMessage) {
      sendMessage("CHANGE_COLOR", { color });
    }
  };

  const handleResetColor = () => {
    setTruckColor(DEFAULT_TRUCK_COLOR);
    if (sendMessage) {
      sendMessage("CHANGE_COLOR", { color: DEFAULT_TRUCK_COLOR });
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleVehicleToggle = () => {
    setVehicleOpen(!vehicleOpen);
  };

  const handleHdriToggle = () => {
    setHdriOpen(!hdriOpen);
  };

  const handlePartSelect = (partId, category) => {
    if (truckRef && scene) {
      let success;
      if (partId === "default") {
        success = resetTruckPart(truckRef, category, scene);
      } else {
        success = replaceTruckPart(truckRef, category, partId, scene);
      }
      if (success) {
        setSelectedParts((prev) => ({
          ...prev,
          [category]: partId,
        }));
      }
    }
    if (sendMessage) {
      sendMessage(partId === "default" ? "RESET_PART" : "REPLACE_PART", {
        category,
        partId,
      });
    }
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <List sx={{ overflowY: "auto", maxHeight: "90vh" }}>
        <VehicleSelection
          selectedTruck={selectedTruck}
          vehicleOpen={vehicleOpen}
          onVehicleToggle={handleVehicleToggle}
          selectedParts={selectedParts}
          onPartSelect={handlePartSelect}
        />
        <ColorCustomization
          colorOpen={colorOpen}
          selectedColor={truckColor}
          onColorChange={handleColorChange}
          onResetColor={handleResetColor}
        />
        <HdriSelection hdriOpen={hdriOpen} onHdriToggle={handleHdriToggle} />
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          display: { xs: "block", sm: "none" },
          width: "100%",
          backgroundColor: "rgba(40, 40, 40, 0.95)",
          color: "#ffffff",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            RC Configurator
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "rgba(40, 40, 40, 0.95)",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
                color: "#ffffff",
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "rgba(40, 40, 40, 0.95)",
                color: "#ffffff",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
}

UI.propTypes = {
  truckRef: PropTypes.object,
};

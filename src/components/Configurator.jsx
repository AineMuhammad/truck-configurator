import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Truck from "./Truck";
import { Suspense } from "react";
import CameraSetup from "../setup/CameraSetup";
import Loader from "./Loader/Loader";
import ARLoader from "./Loader/ARLoader";
import useConfiguratorStore from "../store/useConfiguratorStore";
import { useThree } from "@react-three/fiber";
import { changeTruckColor, resetTruckColor, replaceTruckPart, resetTruckPart, calculateZoomLimits } from '../utils/HelperFunctions';
import { hdriOptions } from '../utils/constants';
import ActionBar from './ActionBar';
import QRCodeModal from './QRCodeModal';
import { exportAndUploadGLB } from '../utils/AWSUploader';
import { DEFAULT_TRUCK_COLOR } from '../utils/constants';

function EnvironmentLoader() {
    const selectedHdri = useConfiguratorStore(state => state.selectedHdri);
    const setIsLoading = useConfiguratorStore(state => state.setIsLoading);
    const loadingProgress = useConfiguratorStore(state => state.loadingProgress);

    useEffect(() => {
        if (loadingProgress === 100 || loadingProgress === 0) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selectedHdri]);

    return (
        <Environment
            files={hdriOptions.find(hdri => hdri.id === selectedHdri)?.file}
            background={selectedHdri !== "neutral"}
            ground={selectedHdri === "neutral" ? false : {
                height: 5,
                radius: 20,
                scale: 20
            }}
            blur={0.5}
        />
    );
}

function SceneContent({ isAutoRotating }) {
    const setScene = useConfiguratorStore(state => state.setScene);
    const truckColor = useConfiguratorStore(state => state.truckColor);
    const setTruckColor = useConfiguratorStore(state => state.setTruckColor);
    const { scene } = useThree();
    const truckRef = useConfiguratorStore(state => state.truckRef);
    const zoomLimits = calculateZoomLimits(truckRef);
    const controlsRef = useRef(null);

    useEffect(() => {
        setScene(scene);
    }, [scene, setScene]);

    useEffect(() => {
        const handleMessage = async (event) => {
            const { type, payload } = event.data;

            console.log(type, payload);
            switch (type) {
                case 'CHANGE_COLOR':
                    if (truckRef) {
                        setTruckColor(payload.color);
                        changeTruckColor(truckRef, payload.color);
                    }
                    break;
                case 'RESET_COLOR':
                    if (truckRef) {
                        resetTruckColor(truckRef);
                        setTruckColor(DEFAULT_TRUCK_COLOR);
                        changeTruckColor(truckRef, DEFAULT_TRUCK_COLOR);
                    }
                    break;
                case 'REPLACE_PART':
                    if (truckRef && scene) {
                        await replaceTruckPart(truckRef, payload.category, payload.partId, scene);
                    }
                    break;
                case 'RESET_PART':
                    if (truckRef && scene) {
                        resetTruckPart(truckRef, payload.category, scene);
                    }
                    break;
                case 'CHANGE_HDRI':
                    useConfiguratorStore.getState().setSelectedHdri(payload.hdri);
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [truckRef, scene]);

    return (
        <>
            <Suspense fallback={null}>
                <EnvironmentLoader />
            </Suspense>
            <ambientLight intensity={0.5} />
            <directionalLight 
                position={[2, 10, 2]}
                intensity={1} 
                castShadow        
            />
            <CameraSetup controlsRef={controlsRef} />
            <Truck />
            <OrbitControls 
                makeDefault 
                autoRotate={isAutoRotating}
                autoRotateSpeed={0.5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2 - 0.05}
                enableDampg={true}
                dampingFactor={0.05}
                minDistance={zoomLimits.minDistance}
                maxDistance={zoomLimits.maxDistance}
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
            />
        </>
    );
}

export default function Configurator() {
    const selectedHdri = useConfiguratorStore(state => state.selectedHdri);
    const isLoading = useConfiguratorStore(state => state.isLoading);
    const isARLoading = useConfiguratorStore(state => state.isARLoading);
    const setIsARLoading = useConfiguratorStore(state => state.setIsARLoading);
    const scene = useConfiguratorStore(state => state.scene);
    const hiddenOriginalParts = useConfiguratorStore(state => state.hiddenOriginalParts);
    const replacedParts = useConfiguratorStore(state => state.replacedParts);
    const truckColor = useConfiguratorStore(state => state.truckColor);
    const containerRef = useRef(null);

    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
    const [arData, setArData] = useState(null);

    const handleAutoRotateToggle = () => {
        setIsAutoRotating(!isAutoRotating);
    };

    const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleExportGLB = async () => {
        if (!scene) {
            console.error('Scene not available for export');
            return;
        }

        if (isARLoading) {
            console.log('AR generation already in progress...');
            return;
        }

        try {
            const storeState = {
                truckColor,
                hiddenOriginalParts,
                replacedParts
            };
            
            const result = await exportAndUploadGLB(scene, storeState, {
                includeLights: false,
                includeEnvironment: false
            }, setIsARLoading);
            
            if (result.glbUrl || result.usdzUrl) {
                setArData({
                    glbUrl: result.glbUrl,
                    usdzUrl: result.usdzUrl,
                    configHash: result.configHash
                });
                setQrCodeModalOpen(true);
            }
            
        } catch (error) {
            console.error('Failed to export and upload GLB:', error);
            alert('Failed to export and upload GLB. Please check console for details.');
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);
    
    return (
        <div 
            ref={containerRef}
            style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                backgroundColor: selectedHdri === "neutral" ? '#f0f0f0' : '#ffffff',
            }}
        >
            <Canvas style={{
                width: '100%',
                height: '100%',
            }}
                shadows
            >
                <Suspense fallback={null}>
                    <SceneContent isAutoRotating={isAutoRotating} />
                </Suspense>
            </Canvas>
            {isLoading && <Loader />}
            {isARLoading && <ARLoader />}
            <ActionBar 
                isAutoRotating={isAutoRotating}
                onAutoRotateToggle={handleAutoRotateToggle}
                isFullscreen={isFullscreen}
                onFullscreenToggle={handleFullscreenToggle}
                onExportGLB={handleExportGLB}
                isARLoading={isARLoading}
            />
            <QRCodeModal 
                open={qrCodeModalOpen}
                onClose={() => setQrCodeModalOpen(false)}
                glbUrl={arData?.glbUrl}
                usdzUrl={arData?.usdzUrl}
                configHash={arData?.configHash}
            />
            
      </div>
    );
} 
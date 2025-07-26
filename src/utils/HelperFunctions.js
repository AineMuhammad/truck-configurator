import * as THREE from 'three';

import { GLTFLoader, DRACOLoader } from 'three/examples/jsm/Addons.js';
import useConfiguratorStore from '../store/useConfiguratorStore';
import { RC_BASE_URL } from './constants';

/**
 * Converts inches to meters
 * @param {number} inches - The height in inches
 * @returns {number} The height in meters
 */
const convertInchesToMeters = (inches) => {
    return inches / 39.37;
};

/**
 * Checks for collisions between the tires and truck body using raycasting
 * @param {Object} object - The Three.js object containing the truck
 * @param {Object} tireRef - Reference to the tire mesh
 * @returns {boolean} - True if there is a collision, false otherwise
 */
export const checkTireCollisions = (object, tireRef) => {
    if (!object || !tireRef) return false;

    let tireTop = null;
    tireRef.traverse((child) => {
        if (child.type === "Mesh") {
            child.geometry.computeBoundingBox();
            const positions = child.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];
                if(tireTop === null || y > tireTop.y) {
                    tireTop = new THREE.Vector3(x, y, z);
                }
            }
            child.updateMatrixWorld();
            tireTop.applyMatrix4(child.matrixWorld);
        }
    })

    // Raycast from the top of the tire, collidable objects are the truck body
    const raycaster = new THREE.Raycaster();
    raycaster.set(tireTop, new THREE.Vector3(0, 1, 0));
    const intersects = raycaster.intersectObjects(object.children, true);
    if(intersects.length > 0) {
        if (intersects[0].distance < convertInchesToMeters(0.25)) {
            return true;
        }
    }

    return false;
};

/**
 * Adjusts the height of a Three.js object by a specified amount
 * @param {Object} object - The Three.js object to adjust
 * @param {number} amount - The amount to adjust the height by (in inches)
 * @param {Object} tireRef - Reference to the tire mesh
 * @returns {boolean} - True if the adjustment was successful, false if blocked by collision
 */
export const adjustTruckHeight = (object, amount, tireRef, isColliding, setIsColliding) => {
    if (object && object.position) {
        const meters = convertInchesToMeters(amount);
        
        // Store original position
        const originalY = object.position.y;
        
        // Try the adjustment
        object.position.y += meters;
        
        if (isColliding && amount > 0 ) {
            return false;
        } 

        if (isColliding && amount < 0) {
            setIsColliding(false);
            return true;
        }

        // Check for collisions
        if (checkTireCollisions(object, tireRef)) {
            // If there's a collision, revert the change
            object.position.y = originalY;
            setIsColliding(true);
            return false;
        }
        
        return true;
    }
    return false;
};

/**
 * Resets the height of a Three.js object to zero
 * @param {Object} object - The Three.js object to reset
 */
export const resetTruckHeight = (object) => {
    if (object && object.position) {
        object.position.y = 0;
    }
};

/**
 * Stores the original materials of the truck body
 * @param {Object} object - The Three.js object containing the truck
 */
export const storeOriginalMaterials = (object) => {
    if (object) {
        object.traverse((child) => {
            if (child.name === "TruckBody") {
                child.children.forEach(truckBodyChild => {
                    if (!truckBodyChild.userData.originalMaterial) {
                        truckBodyChild.userData.originalMaterial = truckBodyChild.material.clone();
                    }
                });
            }
        });
    }
};

/**
 * Changes the color of the truck body
 * @param {Object} object - The Three.js object containing the truck
 * @param {string} color - The color to apply (in hex format)
 */
export const changeTruckColor = (object, color) => {
    if (object) {
        object.traverse((child) => {
            if (child.name === "TruckBody") {
                child.children.forEach(truckBodyChild => {
                    truckBodyChild.material.color.setStyle(color);
                });

            }
        });
    }
};

/**
 * Resets the truck color to its original material
 * @param {Object} object - The Three.js object containing the truck
 */
export const resetTruckColor = (object) => {
    if (object) {
        object.traverse((child) => {
            if (child.name === "TruckBody") {
                child.children.forEach(truckBodyChild => {
                    if (truckBodyChild.userData.originalMaterial) {
                        truckBodyChild.material = truckBodyChild.userData.originalMaterial.clone();
                    }
                });
            }
        });
    }
};

/**
 * Replaces a part in the truck model with a new GLB model
 * @param {Object} truckRef - The truck object reference
 * @param {string} category - The category of the part (e.g., "Wheels & Tires")
 * @param {string} partId - The ID of the new part to load
 * @param {Object} scene - The Three.js scene
 * @returns {Promise<boolean>} - True if the replacement was successful
 */
export const replaceTruckPart = async (truckRef, category, partId, scene) => {
    if (!truckRef || !category || !partId || !scene) return false;

    // Set loading state to true and reset progress
    useConfiguratorStore.getState().setIsLoading(true);
    useConfiguratorStore.getState().setLoadingProgress(0);
    category = category.toLowerCase();
    category = category.replace(/ /g, '_');
    
    
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/draco/' );
    loader.setDRACOLoader(dracoLoader);
    let GLBURL = RC_BASE_URL + partId + '.glb';
    
    try {
        const gltf = await new Promise((resolve, reject) => {
            loader.load(
                GLBURL,
                (gltf) => resolve(gltf),
                (xhr) => {
                    const progress = (xhr.loaded / xhr.total) * 100;
                    useConfiguratorStore.getState().setLoadingProgress(progress);
                },
                (error) => reject(error)
            );
        });

        const newPart = gltf.scene;
        newPart.name = category;
        newPart.visible = true;
        
        // Position the new part relative to the truck
        newPart.position.copy(truckRef.position);
        newPart.rotation.copy(truckRef.rotation);
        
        // Find and hide existing parts of the same category
        truckRef.traverse((child) => {
            if (child.name && child.name.toLowerCase().includes(category)) {
                child.visible = false;
                // Track this hidden original part
                useConfiguratorStore.getState().addHiddenOriginalPart(child);
            }
        });
        
        // Track this replaced part in the store
        useConfiguratorStore.getState().addReplacedPart(newPart);
        
        truckRef.add(newPart);
        useConfiguratorStore.getState().setIsLoading(false);
        useConfiguratorStore.getState().setLoadingProgress(0);
        return true;
    } catch (error) {
        console.error('Error loading model:', error);
        useConfiguratorStore.getState().setIsLoading(false);
        useConfiguratorStore.getState().setLoadingProgress(0);
        return false;
    }
};

/**
 * Resets a part category to its default state by showing original truck parts and removing custom GLBs
 * @param {Object} truckRef - The truck object reference
 * @param {string} category - The category of the part to reset
 * @param {Object} scene - The Three.js scene
 * @returns {boolean} - True if the reset was successful
 */
export const resetTruckPart = (truckRef, category, scene) => {
    if (!truckRef || !category || !scene) return false;

    category = category.toLowerCase();
    category = category.replace(/ /g, '_');

    try {
        // First pass: Collect children to remove (custom GLB models)
        const childrenToRemove = [];
        truckRef.traverse((child) => {
            if (child.name && child.name.toLowerCase().includes(category) && child !== truckRef) {
                childrenToRemove.push(child);
            }
        });

        // Remove the collected children and update store
        childrenToRemove.forEach(child => {
            truckRef.remove(child);
            useConfiguratorStore.getState().removeReplacedPart(child);
        });

        // Second pass: Make original truck parts visible
        truckRef.traverse((child) => {
            if (child.name && child.name.toLowerCase().includes(category)) {
                child.visible = true;
                // Remove from hidden parts tracking
                useConfiguratorStore.getState().removeHiddenOriginalPart(child);
            }
        });

        return true;
    } catch (error) {
        console.error('Error resetting truck part:', error);
        return false;
    }
};

/**
 * Calculates min and max zoom distances based on truck size
 * @param {Object} truckRef - The truck object reference
 * @returns {Object} Object containing minDistance and maxDistance
 */
export const calculateZoomLimits = (truckRef) => {
    if (!truckRef) return { minDistance: 5, maxDistance: 20 };

    // Create a bounding box for the truck
    const boundingBox = new THREE.Box3().setFromObject(truckRef);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    // Calculate distances based on truck size
    // Min distance is 1.5x the largest dimension
    // Max distance is 5x the largest dimension
    const maxDimension = Math.max(size.x, size.y, size.z);
    const minDistance = maxDimension * 0.7;
    const maxDistance = maxDimension * 3;

    return { minDistance, maxDistance };
};


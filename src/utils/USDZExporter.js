import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import * as THREE from 'three';

/**
 * Exports the current scene as a USDZ file, excluding environment, lights, and hidden parts
 * @param {THREE.Scene} scene - The Three.js scene to export
 * @param {Object} storeState - The current store state containing hidden parts info
 * @param {Object} options - Export options
 * @param {boolean} options.includeLights - Whether to include lights in the export (default: false)
 * @param {boolean} options.includeEnvironment - Whether to include environment in the export (default: false)
 * @returns {Promise<Blob>} - The exported USDZ as a Blob
 */
export const exportSceneAsUSDZ = async (scene, storeState = {}, options = {}) => {
  const {
    includeLights = false,
    includeEnvironment = false
  } = options;

  const { hiddenOriginalParts = [], replacedParts = [] } = storeState;

  return new Promise((resolve, reject) => {
    try {
      // Create a temporary scene for export
      const exportScene = scene.clone();
      
      // Remove environment and lights if not included
      if (!includeEnvironment) {
        exportScene.children = exportScene.children.filter(child => {
          // Remove environment meshes (ground, skybox, etc.)
          if (child.type === 'Mesh' && child.material && child.material.isShadowMaterial) {
            return false; // Remove shadow plane
          }
          return true;
        });
      }
      
      if (!includeLights) {
        exportScene.children = exportScene.children.filter(child => {
          return child.type !== 'DirectionalLight' && 
                 child.type !== 'AmbientLight' && 
                 child.type !== 'PointLight' && 
                 child.type !== 'SpotLight';
        });
      }

      // Remove hidden parts and fix material issues for USDZ export
      exportScene.traverse((child) => {
        if (child.isMesh) {
          // Check if this mesh should be hidden based on store state
          const shouldHide = hiddenOriginalParts.some(hiddenPart => 
            child.name === hiddenPart.name && child.type === hiddenPart.type
          );
          
          if (shouldHide) {
            child.visible = false;
          }
          
          // Fix USDZ compatibility issues
          if (child.material) {
            // USDZ doesn't support double-sided materials, so we need to clone and fix them
            if (Array.isArray(child.material)) {
              child.material = child.material.map(mat => {
                const newMat = mat.clone();
                newMat.side = THREE.FrontSide; // Force single-sided for USDZ
                return newMat;
              });
            } else {
              const newMat = child.material.clone();
              newMat.side = THREE.FrontSide; // Force single-sided for USDZ
              child.material = newMat;
            }
          }
        }
      });

      // Export the scene using the simpler API
      const exporter = new USDZExporter();
      exporter.parse(
        exportScene,
        (usdzArrayBuffer) => {
          const blob = new Blob([usdzArrayBuffer], { type: 'model/vnd.usdz+zip' });
          resolve(blob);
        },
        { binary: true }
      );

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Downloads a USDZ blob as a file
 * @param {Blob} blob - The USDZ blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadUSDZ = (blob, filename = 'truck-configuration.usdz') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports and downloads the current scene as a USDZ file
 * @param {THREE.Scene} scene - The Three.js scene to export
 * @param {Object} storeState - The current store state containing hidden parts info
 * @param {string} filename - The filename for the download
 * @param {Object} options - Export options
 * @returns {Promise<void>}
 */
export const exportAndDownloadUSDZ = async (scene, storeState = {}, filename = 'truck-configuration.usdz', options = {}) => {
  try {
    const blob = await exportSceneAsUSDZ(scene, storeState, options);
    downloadUSDZ(blob, filename);
  } catch (error) {
    console.error('Failed to export USDZ:', error);
    throw error;
  }
}; 
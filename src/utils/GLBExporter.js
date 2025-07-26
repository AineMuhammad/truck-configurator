import { GLTFExporter } from 'three/examples/jsm/Addons.js';

/**
 * Exports the current scene as a GLB file, excluding environment, lights, and hidden parts
 * @param {THREE.Scene} scene - The Three.js scene to export
 * @param {Object} storeState - The current store state containing hidden parts info
 * @param {Object} options - Export options
 * @param {boolean} options.includeLights - Whether to include lights in the export (default: false)
 * @param {boolean} options.includeEnvironment - Whether to include environment in the export (default: false)
 * @returns {Promise<Blob>} - The exported GLB as a Blob
 */
export const exportSceneAsGLB = async (scene, storeState = {}, options = {}) => {
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

      // Remove hidden parts from the export scene
      exportScene.traverse((child) => {
        if (child.isMesh) {
          // Check if this mesh should be hidden based on store state
          const shouldHide = hiddenOriginalParts.some(hiddenPart => 
            child.name === hiddenPart.name && child.type === hiddenPart.type
          );
          
          if (shouldHide) {
            child.visible = false;
          }
        }
      });

      // Configure exporter options
      const exporterOptions = {
        binary: true, // Export as GLB (binary)
        includeCustomExtensions: true,
        forceIndices: true,
        forcePowerOfTwoTextures: false,
        maxTextureSize: 4096,
        animations: [], // No animations for now
        embedImages: true,
        onlyVisible: true, // Only export visible meshes
        truncateDrawRange: true,
        binary: true
      };

      // Export the scene
      const exporter = new GLTFExporter();
      exporter.parse(
        exportScene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            resolve(blob);
          } else {
            reject(new Error('Export failed: Invalid result format'));
          }
        },
        (error) => {
          reject(error);
        },
        exporterOptions
      );

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Downloads a GLB blob as a file
 * @param {Blob} blob - The GLB blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadGLB = (blob, filename = 'truck-configuration.glb') => {
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
 * Exports and downloads the current scene as a GLB file
 * @param {THREE.Scene} scene - The Three.js scene to export
 * @param {Object} storeState - The current store state containing hidden parts info
 * @param {string} filename - The filename for the download
 * @param {Object} options - Export options
 * @returns {Promise<void>}
 */
export const exportAndDownloadGLB = async (scene, storeState = {}, filename = 'truck-configuration.glb', options = {}) => {
  try {
    const blob = await exportSceneAsGLB(scene, storeState, options);
    downloadGLB(blob, filename);
  } catch (error) {
    console.error('Failed to export GLB:', error);
    throw error;
  }
}; 
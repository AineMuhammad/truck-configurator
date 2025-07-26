import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { AWS_CONFIG } from './awsConfig.js';
import { generateARLinks } from './ARLinkGenerator.js';  

/**
 * Generates a unique hash for the current truck configuration
 * @param {Object} storeState - The current store state
 * @returns {string} - Unique hash for the configuration
 */
export const generateConfigHash = (storeState) => {
    const { truckColor, replacedParts, hiddenOriginalParts } = storeState;
    
    // Create a configuration object
    const config = {
        color: truckColor,
        replacedParts: replacedParts.map(part => part.name || part.uuid).sort(),
        hiddenParts: hiddenOriginalParts.map(part => part.name).sort()
    };
    
    // Create a hash of the configuration
    const configString = JSON.stringify(config);
    let hash = 0;
    for (let i = 0; i < configString.length; i++) {
        const char = configString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive hex string
    return Math.abs(hash).toString(16);
};

/**
 * Generates filenames based on configuration hash
 * @param {string} hash - The configuration hash
 * @returns {Object} - Object containing GLB and USDZ filenames
 */
export const generateFilenames = (hash) => {
    return {
        glb: `${hash}.glb`,
        usdz: `${hash}.usdz`
    };
};

/**
 * Checks if a USDZ file exists in S3
 * @param {string} usdzKey - The S3 key for the USDZ file
 * @returns {Promise<boolean>} - True if file exists, false otherwise
 */
export const checkUSDZExists = async (usdzKey) => {
    try {
        const s3Client = new S3Client({
            region: AWS_CONFIG.REGION,
            credentials: {
                accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
                secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
            },
        });

        const headCommand = new HeadObjectCommand({
            Bucket: AWS_CONFIG.BUCKET_NAME,
            Key: usdzKey,
        });

        await s3Client.send(headCommand);
        return true;
    } catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            return false;
        }
        console.error('Error checking USDZ existence:', error);
        throw error;
    }
};



/**
 * Uploads a GLB blob to AWS S3
 * @param {Blob} blob - The GLB blob to upload
 * @param {string} filename - The filename for the upload
 * @param {Function} callback - Optional callback function
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
export const uploadGLBToS3 = async (blob, filename, callback = undefined) => {
    try {
        // Create S3 client
        const s3Client = new S3Client({
            region: AWS_CONFIG.REGION,
            credentials: {
                accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
                secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
            },
        });
        
        // Create the S3 key (path in bucket)
        const key = `${AWS_CONFIG.FOLDER_PATH}/${filename}`;
        
        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        // Create upload command
        const uploadCommand = new PutObjectCommand({
            Bucket: AWS_CONFIG.BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: 'model/gltf-binary',
            CacheControl: 'no-cache',
            ACL: 'public-read',
        });

        // Upload to S3
        await s3Client.send(uploadCommand);
        
        const s3Url = `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${key}`;
        console.log('GLB uploaded successfully:', s3Url);
        
        if (callback) callback(true, s3Url);
        return s3Url;
        
    } catch (error) {
        console.error('S3 upload error:', error);
        if (callback) callback(false);
        throw error;
    }
};

/**
 * Uploads a USDZ blob to AWS S3
 * @param {Blob} blob - The USDZ blob to upload
 * @param {string} filename - The filename for the upload
 * @param {Function} callback - Optional callback function
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
export const uploadUSDZToS3 = async (blob, filename, callback = undefined) => {
    try {
        // Create S3 client
        const s3Client = new S3Client({
            region: AWS_CONFIG.REGION,
            credentials: {
                accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
                secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
            },
        });
        
        // Create the S3 key (path in bucket) - USDZ files go to rough-country-usdz folder
        const key = `rough-country-usdz/${filename}`;
        
        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        // Create upload command
        const uploadCommand = new PutObjectCommand({
            Bucket: AWS_CONFIG.BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: 'model/vnd.usdz+zip',
            CacheControl: 'no-cache',
            ACL: 'public-read',
        });

        // Upload to S3
        await s3Client.send(uploadCommand);
        
        const s3Url = `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${key}`;
        
        if (callback) callback(true, s3Url);
        return s3Url;
        
    } catch (error) {
        console.error('S3 upload error:', error);
        if (callback) callback(false);
        throw error;
    }
};

/**
 * Exports scene as GLB and USDZ, then uploads both to AWS S3
 * @param {THREE.Scene} scene - The Three.js scene to export
 * @param {Object} storeState - The current store state
 * @param {Object} options - Export options
 * @param {Function} onARLoadingChange - Callback to update AR loading state
 * @returns {Promise<Object>} - Object containing GLB URL and USDZ URL
 */
export const exportAndUploadGLB = async (scene, storeState, options = {}, onARLoadingChange = null) => {
    try {
        // Import the export functions dynamically to avoid circular dependencies
        const { exportSceneAsGLB } = await import('./GLBExporter.js');
        const { exportSceneAsUSDZ } = await import('./USDZExporter.js');
        
        console.log('Starting GLB and USDZ export and upload...');
        
        // Set AR loading state
        if (onARLoadingChange) {
            onARLoadingChange(true);
        }
        
        // Generate configuration hash
        const configHash = generateConfigHash(storeState);
        console.log('Configuration hash:', configHash);
        
        // Generate filenames
        const filenames = generateFilenames(configHash);
        console.log('Generated filenames:', filenames);
        
        // Check if USDZ already exists
        const usdzKey = `rough-country-usdz/${filenames.usdz}`;
        const usdzExists = await checkUSDZExists(usdzKey);
        
        if (usdzExists) {
            const usdzUrl = `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${usdzKey}`;
            const glbUrl = `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${AWS_CONFIG.FOLDER_PATH}/${filenames.glb}`;
            
            // Generate AR links with both GLB and USDZ
            const arLinks = generateARLinks(glbUrl, usdzUrl, configHash);
            
            // Clear AR loading state
            if (onARLoadingChange) {
                onARLoadingChange(false);
            }
            
            return {
                glbUrl: glbUrl, // GLB was already generated
                usdzUrl: usdzUrl,
                configHash: configHash,
                arLinks: arLinks
            };
        }
        
        // Export the scene as both GLB and USDZ
        console.log('Exporting scene as GLB...');
        const glbBlob = await exportSceneAsGLB(scene, storeState, options);
        
        console.log('Exporting scene as USDZ...');
        const usdzBlob = await exportSceneAsUSDZ(scene, storeState, options);
        
        const glbUrl = await uploadGLBToS3(glbBlob, filenames.glb);
        const usdzUrl = await uploadUSDZToS3(usdzBlob, filenames.usdz);
        
        // Generate AR links with both GLB and USDZ
        const arLinks = generateARLinks(glbUrl, usdzUrl, configHash);
        
        // Clear AR loading state
        if (onARLoadingChange) {
            onARLoadingChange(false);
        }
        
        console.log('GLB and USDZ export and upload completed successfully');
        return {
            glbUrl: glbUrl,
            usdzUrl: usdzUrl,
            configHash: configHash,
            arLinks: arLinks
        };
        
    } catch (error) {
        if (onARLoadingChange) {
            onARLoadingChange(false);
        }
    }
}; 
/**
 * Generates AR-compatible viewer links for both Android and iOS platforms
 * @param {string} glbUrl - The URL to the GLB file
 * @param {string} usdzUrl - The URL to the USDZ file (optional)
 * @param {string} configHash - The configuration hash for tracking
 * @returns {Object} - Object containing AR links for different platforms
 */
export const generateARLinks = (glbUrl, usdzUrl = null, configHash = '') => {
    // Android Google Scene Viewer link (opens directly in AR mode)
    const androidARLink = glbUrl ? `intent://arvr.google.com/scene-viewer/1.0?file=${glbUrl}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;end;` : null;
    
    // iOS Quick Look link (if USDZ is available)
    const iosARLink = usdzUrl ? usdzUrl : null;
    
    // Universal AR link that works on both platforms
    const universalARLink = generateUniversalARLink(glbUrl, usdzUrl, configHash);
    
    return {
        android: androidARLink,
        ios: iosARLink,
        universal: universalARLink,
        configHash: configHash
    };
};

/**
 * Generates a universal AR link that works on both platforms
 * @param {string} glbUrl - The URL to the GLB file
 * @param {string} usdzUrl - The URL to the USDZ file (optional)
 * @param {string} configHash - The configuration hash for tracking
 * @returns {string} - Universal AR link
 */
const generateUniversalARLink = (glbUrl, usdzUrl = null, configHash = '') => {
    // Create a simple HTML page that detects the platform and redirects accordingly
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View in AR - Truck Configuration</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
        }
        .ar-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 40px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 24px;
        }
        p {
            color: #7f8c8d;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        .ar-button {
            display: inline-block;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s;
            margin: 10px;
        }
        .ar-button:hover {
            transform: translateY(-2px);
        }
        .fallback {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            font-size: 14px;
        }
        .config-hash {
            font-family: monospace;
            background: #f1f2f6;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="ar-icon">📱</div>
        <h1>View in AR</h1>
        <p>Experience your truck configuration in augmented reality</p>
        
        <div id="ar-buttons">
            <!-- Buttons will be populated by JavaScript -->
        </div>
        
        <div class="fallback">
            <p>If AR doesn't open automatically, try:</p>
            <a href="${glbUrl}" class="ar-button" download>Download GLB File</a>
        </div>
        
        ${configHash ? `<div class="config-hash">Config: ${configHash}</div>` : ''}
    </div>

        <script>
        (function() {
            const glbUrl = '${glbUrl}';
            const usdzUrl = '${usdzUrl || ''}';
            const buttonsContainer = document.getElementById('ar-buttons');
            
            // Detect platform using the same logic as the reference code
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
            const isAndroid = /android/i.test(userAgent);
            
            if (isIOS && usdzUrl) {
                // iOS Quick Look - direct USDZ link
                const quickLookLink = document.createElement('a');
                quickLookLink.href = usdzUrl;
                quickLookLink.rel = 'ar';
                quickLookLink.className = 'ar-button';
                quickLookLink.textContent = 'View in AR (iOS)';
                buttonsContainer.appendChild(quickLookLink);
            } else if (isAndroid && glbUrl) {
                // Android Scene Viewer - direct intent link
                const sceneViewerLink = document.createElement('a');
                sceneViewerLink.href = 'intent://arvr.google.com/scene-viewer/1.0?file=' + glbUrl + '&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;end;';
                sceneViewerLink.className = 'ar-button';
                sceneViewerLink.textContent = 'View in AR (Android)';
                buttonsContainer.appendChild(sceneViewerLink);
            } else {
                // Fallback for unsupported platforms
                const fallbackText = document.createElement('p');
                fallbackText.textContent = 'AR is only supported on Android and iOS devices.';
                fallbackText.style.color = '#7f8c8d';
                fallbackText.style.fontSize = '14px';
                buttonsContainer.appendChild(fallbackText);
            }
        })();
    </script>
</body>
</html>`;

    // For now, we'll return the HTML content as a data URL
    // In a real implementation, you might want to save this as a file on your server
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
};

/**
 * Creates a simple AR viewer page URL
 * @param {string} glbUrl - The URL to the GLB file
 * @param {string} usdzUrl - The URL to the USDZ file (optional)
 * @param {string} configHash - The configuration hash for tracking
 * @returns {string} - URL to the AR viewer page
 */
export const createARViewerPage = (glbUrl, usdzUrl = null, configHash = '') => {
    // This would typically save the HTML to your server and return the URL
    // For now, we'll return the data URL version
    return generateUniversalARLink(glbUrl, usdzUrl, configHash);
};

/**
 * Generates QR code data for AR links
 * @param {string} arLink - The AR link to encode
 * @returns {string} - QR code data URL
 */
export const generateARQRCode = (arLink) => {
    // This would typically use a QR code library
    // For now, we'll return a placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arLink)}`;
};

/**
 * Updates existing AR links with USDZ URL when it becomes available
 * @param {Object} existingArLinks - Existing AR links object
 * @param {string} usdzUrl - The USDZ URL to add
 * @returns {Object} - Updated AR links object
 */
export const updateARLinksWithUSDZ = (existingArLinks, usdzUrl) => {
    if (!existingArLinks || !usdzUrl) return existingArLinks;
    
    return generateARLinks(existingArLinks.glbUrl || null, usdzUrl, existingArLinks.configHash);
};

/**
 * Opens AR directly based on platform detection (same logic as reference code)
 * @param {string} glbUrl - The GLB file URL
 * @param {string} usdzUrl - The USDZ file URL (optional)
 */
export const openAR = (glbUrl, usdzUrl = null) => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/iPhone|iPad|iPod/i.test(userAgent) && usdzUrl) {
        // iOS - direct USDZ link
        window.location.href = usdzUrl;
    } else if (/android/i.test(userAgent) && glbUrl) {
        // Android - direct intent link
        window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${glbUrl}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;end;`;
    } else {
        // Fallback for unsupported platforms
        alert("AR is only supported on Android and iOS devices.");
    }
}; 
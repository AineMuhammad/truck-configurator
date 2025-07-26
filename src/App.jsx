import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import UI from './components/UI/UI';

function App() {
  const configuratorRef = useRef(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const isStandalone = false;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setIsDebugMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Example message sending function
  const sendMessage = (type, payload) => {
    if (configuratorRef.current) {
      configuratorRef.current.contentWindow.postMessage({ type, payload }, '*');
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!isStandalone && (
        <Box sx={{ width: 300, height: '100vh', flexShrink: 0 }}>
          <UI
            configuratorRef={configuratorRef}
            isDebugMode={isDebugMode}
            sendMessage={sendMessage}
          />
        </Box>
      )}
      <Box sx={{ width: 'calc(100vw - 300px)', height: '100vh', flexGrow: 1 }}>
        <iframe
          ref={configuratorRef}
          src={window.location.origin + '/#/configurator'}
          style={{ width: '100%', height: '100%', overflow: 'hidden', border: 'none' }}
          id="rough-country-configurator"
        />
      </Box>
    </Box>
  );
}

export default App; 
import useConfiguratorStore from '../store/useConfiguratorStore';

class IframeMessageHandler {
  constructor() {
    this.store = useConfiguratorStore;
    this.setupMessageListener();
  }

  setupMessageListener() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  handleMessage(event) {
    const { type, payload } = event.data;
    
    try {
      switch (type) {
        case 'UPDATE_MODEL':
          this.handleModelUpdate(payload);
          break;
          
        case 'UPDATE_CAMERA':
          this.handleCameraUpdate(payload);
          break;
          
        case 'LOAD_CONFIGURATION':
          this.handleConfigurationLoad(payload);
          break;
          
        case 'REQUEST_CURRENT_STATE':
          this.sendCurrentState();
          break;
      }
    } catch (error) {
      this.sendError(error.message);
    }
  }

  handleModelUpdate(payload) {
    const { part, value } = payload;
    if (!part || !value) {
      throw new Error('Invalid model update payload');
    }

    this.store.getState().updatePart(part, value);
    this.sendSuccess('MODEL_UPDATED', { part, value });
  }

  handleCameraUpdate(payload) {
    const { position, rotation } = payload;
    // Your camera update logic here
    this.sendSuccess('CAMERA_UPDATED', { position, rotation });
  }

  handleConfigurationLoad(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration payload');
    }

    Object.entries(config).forEach(([part, value]) => {
      this.store.getState().updatePart(part, value);
    });
    
    this.sendSuccess('CONFIGURATION_LOADED', config);
  }

  sendCurrentState() {
    const currentState = {
      selectedParts: this.store.getState().selectedParts,
      // Add any other state you want to expose
    };
    
    this.sendSuccess('CURRENT_STATE', currentState);
  }

  sendSuccess(type, data) {
    if (window.parent) {
      window.parent.postMessage({
        type,
        status: 'success',
        data
      }, '*');
    }
  }

  sendError(message) {
    if (window.parent) {
      window.parent.postMessage({
        type: 'ERROR',
        status: 'error',
        message
      }, '*');
    }
  }
}

// Create and export singleton instance
const messageHandler = new IframeMessageHandler();
export default messageHandler; 
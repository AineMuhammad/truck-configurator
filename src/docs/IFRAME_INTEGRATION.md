# Truck Configurator Iframe Integration Guide

This guide provides step-by-step instructions for integrating the truck configurator as an iframe into a parent application, along with available communication commands.

## 1. Basic Setup

### Adding the Iframe to Your Page
To embed the configurator, add the following iframe to your page:
```html
<iframe 
  src="https://your-configurator-url.com" 
  id="configurator-iframe"
  width="100%" 
  height="600px"
  style="border: none;"
></iframe>
```

### Initializing Communication with the Iframe
To interact with the configurator, use the `postMessage` API to send and receive messages.
```javascript
const iframe = document.getElementById('configurator-iframe');

// Helper function to send messages to the iframe
function sendToConfigurator(type, payload) {
  iframe.contentWindow.postMessage({ type, payload }, '*');
}
```

## 2. Available Commands
The parent application can send the following commands to the iframe:

### **2.1 Update Model**
Updates a specific part of the truck model.
```javascript
sendToConfigurator('UPDATE_MODEL', {
  part: 'truckModel',  // Options: 'truckModel', 'tyreModel', 'wheelModel', 'bullBar' etc.
  value: 'model_name'
});
```

### **2.2 Load Configuration**
Loads a complete configuration state.
```javascript
sendToConfigurator('LOAD_CONFIGURATION', {
  truckModel: 'Truck_1',
  tyreModel: 'Tire_1',
  wheelModel: 'Wheel_1',
  bullBar: 'BullBar_1'
});
```

### **2.3 Change Truck Color**
Updates the truck’s material color.
```javascript
sendToConfigurator('CHANGE_COLOR', {
  color: '#FF5733'  // Hex code for the desired color
});
```

### **2.4 Reset Configuration**
Resets the truck to its default configuration.
```javascript
sendToConfigurator('RESET_CONFIGURATION', {});
```

### **2.5 Get Current Configuration**
Requests the current configuration state. The iframe will send a response back.
```javascript
sendToConfigurator('GET_CONFIGURATION', {});
```

```

## 3. Example Integration
Here’s a complete example integrating the configurator with interactive buttons:
```html
<button onclick="sendToConfigurator('CHANGE_COLOR', { color: '#00FF00' })">Green Truck</button>
<button onclick="sendToConfigurator('RESET_CONFIGURATION', {})">Reset</button>
```

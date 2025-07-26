# Truck Configurator

A powerful, interactive 3D truck configurator built with React, Three.js, and modern web technologies. This application allows users to customize trucks in real-time with an intuitive interface, featuring color customization, part swapping, environment changes, and seamless iframe integration.

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/369cd92c-73df-48ab-a2ec-57490eba59ca" />
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/5e6115d5-3f4e-4b9a-99e5-73c2475acab1" />


## Features

### **Color Customization**

- **10+ Predefined Colors**: Choose from a curated palette including Cajun Red, Summit White, Black, Dark Ash, Glacier Blue, and more
- **Real-time Preview**: See color changes instantly on the 3D model
- **Custom Color Support**: Apply any hex color code for unlimited customization

### **Part Customization**

- **Wheels**: Multiple wheel options including 83 Series Wheel
- **Tires**: Various tire models like 35x12.50R20 M/T with dual sidewall
- **Bumpers**: High clearance front bumpers with LED lights and skid plates
- **Winch Mounts**: Exo winch mount kits
- **Side Steps**: SRX2 adjustable aluminum steps
- **Easy Part Swapping**: Click to replace or reset any part to default

### **Environment & Lighting**

- **Multiple HDRI Environments**:
  - Neutral Studio (default)
  - Sunset scenes
  - Warehouse environments
  - Snow landscapes
- **Dynamic Lighting**: Realistic lighting that adapts to each environment
- **Thumbnail Previews**: Visual previews for each environment option

### **Responsive Design**

- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Intuitive touch controls for mobile devices
- **Collapsible UI**: Clean, organized interface that adapts to screen size

### **Iframe Integration**

- **Seamless Embedding**: Easy integration into any website
- **Message API**: Full communication between parent and iframe
- **State Management**: Maintain configuration state across sessions

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd truck-configurator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔌 Iframe Integration

The truck configurator is designed for easy integration into any website using iframes. Here's how to get started:

### Basic Integration

```html
<iframe
  src="https://your-configurator-url.com"
  id="configurator-iframe"
  width="100%"
  height="600px"
  style="border: none; border-radius: 8px;"
></iframe>
```

### Communication API

The configurator supports bidirectional communication with the parent application:

```javascript
const iframe = document.getElementById("configurator-iframe");

// Helper function to send messages
function sendToConfigurator(type, payload) {
  iframe.contentWindow.postMessage({ type, payload }, "*");
}

// Listen for responses from the configurator
window.addEventListener("message", (event) => {
  if (event.source === iframe.contentWindow) {
    console.log("Configurator response:", event.data);
  }
});
```

### Available Commands

#### Change Truck Color

```javascript
sendToConfigurator("CHANGE_COLOR", {
  color: "#FF5733", // Any hex color
});
```

#### 🔧 Update Truck Parts

```javascript
sendToConfigurator("UPDATE_MODEL", {
  part: "truckModel", // Options: 'truckModel', 'tyreModel', 'wheelModel', 'bullBar'
  value: "model_name",
});
```

#### Load Complete Configuration

```javascript
sendToConfigurator("LOAD_CONFIGURATION", {
  truckModel: "Truck_1",
  tyreModel: "Tire_1",
  wheelModel: "Wheel_1",
  bullBar: "BullBar_1",
  color: "#e20407",
});
```

#### Reset Configuration

```javascript
sendToConfigurator("RESET_CONFIGURATION", {});
```

#### Get Current Configuration

```javascript
sendToConfigurator("GET_CONFIGURATION", {});
```

### Complete Integration Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Truck Configurator Demo</title>
    <style>
      .controls {
        margin: 20px 0;
      }
      .controls button {
        margin: 5px;
        padding: 10px 15px;
      }
      iframe {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <div class="controls">
      <button onclick="changeColor('#e20407')">Red Truck</button>
      <button onclick="changeColor('#0280c2')">Blue Truck</button>
      <button onclick="changeColor('#09090e')">Black Truck</button>
      <button onclick="resetConfig()">Reset</button>
      <button onclick="getConfig()">Get Config</button>
    </div>

    <iframe
      src="https://your-configurator-url.com"
      id="configurator-iframe"
      width="100%"
      height="600px"
      style="border: none;"
    ></iframe>

    <script>
      const iframe = document.getElementById("configurator-iframe");

      function sendToConfigurator(type, payload) {
        iframe.contentWindow.postMessage({ type, payload }, "*");
      }

      function changeColor(color) {
        sendToConfigurator("CHANGE_COLOR", { color });
      }

      function resetConfig() {
        sendToConfigurator("RESET_CONFIGURATION", {});
      }

      function getConfig() {
        sendToConfigurator("GET_CONFIGURATION", {});
      }

      // Listen for responses
      window.addEventListener("message", (event) => {
        if (event.source === iframe.contentWindow) {
          console.log("Configurator response:", event.data);
        }
      });
    </script>
  </body>
</html>
```

## Technology Stack

- **Frontend**: React 19, Vite
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **UI Framework**: Material-UI (MUI)
- **State Management**: Zustand
- **3D Model Format**: GLB/GLTF
- **Environment Maps**: HDR/EXR files
- **Deployment**: AWS S3 with CloudFront

## Project Structure

```
truck-configurator/
├── src/
│   ├── components/
│   │   ├── UI/                 # User interface components
│   │   │   ├── ColorCustomization.jsx
│   │   │   ├── HdriSelection.jsx
│   │   │   ├── VehicleSelection.jsx
│   │   │   └── UI.jsx
│   │   ├── Configurator.jsx    # Main configurator component
│   │   └── Truck.jsx           # 3D truck model component
│   ├── data/
│   │   └── vehicleOptions.json # Available parts and vehicles
│   ├── store/
│   │   └── useConfiguratorStore.js # State management
│   ├── utils/
│   │   ├── constants.js        # Color options, HDRI options
│   │   └── HelperFunctions.js  # 3D model manipulation
│   └── messageBus/
│       └── IframeMessageHandler.js # Iframe communication
├── public/
│   ├── models/                 # 3D model files
│   ├── hdr/                    # Environment maps
│   └── thumbnails/             # UI thumbnails
└── docs/
    └── IFRAME_INTEGRATION.md   # Detailed integration guide
```

## Key Features in Detail

### Color System

- **Predefined Palette**: 10 carefully selected colors matching real truck paint options
- **Custom Colors**: Support for any hex color code
- **Real-time Updates**: Instant visual feedback when changing colors
- **Material Properties**: Proper PBR materials for realistic rendering

### Part System

- **Modular Design**: Each part can be independently swapped
- **Category Organization**: Parts organized by type (wheels, tires, bumpers, etc.)
- **Default States**: Easy reset to original configuration
- **Visual Feedback**: Clear indication of selected parts

### Environment System

- **HDRI Maps**: High-quality environment maps for realistic lighting
- **Multiple Scenes**: Studio, outdoor, and specialty environments
- **Thumbnail Previews**: Visual selection interface
- **Dynamic Loading**: Efficient loading and switching between environments

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to AWS S3

### Adding New Features

1. **New Colors**: Add to `src/utils/constants.js` in the `truckColors` array
2. **New Parts**: Add to `src/data/vehicleOptions.json` and implement in `HelperFunctions.js`
3. **New Environments**: Add HDRI files to `public/hdr/` and update `constants.js`

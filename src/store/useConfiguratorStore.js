import { create } from "zustand";
import { DEFAULT_TRUCK_COLOR } from '../utils/constants';

const useConfiguratorStore = create((set, get) => ({
  selectedParts: {
    truckModel: "Truck",
    tyreModel: "Tire",
    wheelModel: "Wheel_1",
  },
  selectedHdri: "neutral",
  truckRef: null,
  scene: null,
  isLoading: false,
  loadingProgress: 0,
  isARLoading: false, // New state for AR loading
  replacedParts: [],
  hiddenOriginalParts: [],
      truckColor: DEFAULT_TRUCK_COLOR,
  setTruckColor: (color) => set({ truckColor: color }),
  updatePart: (part, value) =>
    set((state) => ({
      selectedParts: { ...state.selectedParts, [part]: value },
    })),
  setTruckRef: (ref) => set({ truckRef: ref, isLoading: false, loadingProgress: 0 }),
  setScene: (scene) => set({ scene }),
  setIsLoading: (isLoading) => set({ isLoading, loadingProgress: isLoading ? 0 : 0 }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setIsARLoading: (isARLoading) => set({ isARLoading }), // New setter for AR loading
  setHdri: (hdri) => {
    set({ isLoading: true, loadingProgress: 0 });
    set({ selectedHdri: hdri });
  },
  setSelectedHdri: (hdri) => set({ selectedHdri: hdri }),
  highPolyLoaded: false,
  setHighPolyLoaded: (loaded) => set({ highPolyLoaded: loaded }),
  addReplacedPart: (part) => set((state) => ({ 
    replacedParts: [...state.replacedParts, part] 
  })),
  removeReplacedPart: (part) => set((state) => ({ 
    replacedParts: state.replacedParts.filter(p => p !== part) 
  })),
  clearReplacedParts: () => set({ replacedParts: [] }),
  addHiddenOriginalPart: (part) => set((state) => ({ 
    hiddenOriginalParts: [...state.hiddenOriginalParts, part] 
  })),
  removeHiddenOriginalPart: (part) => set((state) => ({ 
    hiddenOriginalParts: state.hiddenOriginalParts.filter(p => p !== part) 
  })),
  clearHiddenOriginalParts: () => set({ hiddenOriginalParts: [] }),
}));

export default useConfiguratorStore;

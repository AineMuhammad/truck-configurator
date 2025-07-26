import { useGLTF } from "@react-three/drei";
import { GLTFLoader, DRACOLoader } from 'three/examples/jsm/Addons.js';
import useConfiguratorStore from "../store/useConfiguratorStore";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { storeOriginalMaterials, changeTruckColor } from '../utils/HelperFunctions';
import * as THREE from 'three';

function Truck() {

  const highPolyLoaded = useConfiguratorStore(state => state.highPolyLoaded);
  const setHighPolyLoaded = useConfiguratorStore(state => state.setHighPolyLoaded);
  const { scene } = useThree();
  const { setTruckRef, truckRef, setLoadingProgress, setIsLoading, replacedParts, hiddenOriginalParts, truckColor } = useConfiguratorStore();
  const [truckScene, setTruckScene] = useState(null);
  const [highPolyScene, setHighPolyScene] = useState(null);
  
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  loader.setDRACOLoader(dracoLoader);

  useEffect(() => {
    if(truckScene) return;
    setIsLoading(true);
    // Load low-poly version first
    loader.load('/models/RC/Truck.glb', (gltf) => {
      setTruckScene(gltf.scene);
      const timer = setTimeout(() => {
        setIsLoading(false);
        loadHighPoly();
      }, 500);
      return () => clearTimeout(timer);
    }, (xhr) => {
      setLoadingProgress(xhr.loaded / xhr.total * 100);
    });

  }, [scene]);

  const loadHighPoly = () => {
    // Load high-poly version in background
    loader.load('/models/RC/High/Truck.glb', (gltf) => {
      setHighPolyScene(gltf.scene);
      setHighPolyLoaded(true);
    });    
  }

  useEffect(() => {
    if (truckScene && scene && !highPolyLoaded) {
      // set the truck ref
      // store the original materials
      storeOriginalMaterials(truckScene);

      // Enable shadows for all meshes in the truck scene
      truckScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.shadowSide = THREE.BackSide;
          }
        }
      });

      // Calculate truck bounds for shadow plane
      const box = new THREE.Box3().setFromObject(truckScene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(size.x * 1.5, size.z * 1.5),
        new THREE.ShadowMaterial({ opacity: 0.1 })
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(center.x, box.min.y, center.z);
      shadowPlane.receiveShadow = true;
      
      scene.add(shadowPlane);
      setTruckRef(truckScene);
      changeTruckColor(truckScene, truckColor);
    }
  }, [truckScene, truckRef, scene]);

  // Replace low-poly with high-poly when ready
  useEffect(() => {
    if (highPolyLoaded && truckRef && truckScene && scene) {
      storeOriginalMaterials(highPolyScene);
      highPolyScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.shadowSide = THREE.BackSide;
          }
        }
      });

      hiddenOriginalParts.forEach(hiddenPart => {
        highPolyScene.traverse((child) => {
          if (child.name === hiddenPart.name && child.type === hiddenPart.type) {
            child.visible = false;
          }
        });
      });
    
      replacedParts.forEach(part => {
        highPolyScene.add(part);
      });
      setTruckRef(highPolyScene);
      setTruckScene(highPolyScene);
      scene.remove(truckScene);
      scene.add(highPolyScene);
      console.log('High-poly truck model loaded and replaced low-poly version');      
    }
  }, [highPolyLoaded, highPolyScene]);

  useEffect(() => {
    if (highPolyLoaded && truckRef && truckColor) {
      changeTruckColor(truckRef, truckColor);
    }
  }, [truckColor, highPolyLoaded, truckRef]);

  if (!truckScene) return null;
  
  return <primitive object={truckScene} position={[0, 0, 0]} />;
}

export default Truck;

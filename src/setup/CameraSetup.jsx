import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import useConfiguratorStore from "../store/useConfiguratorStore";

export default function CameraSetup({ controlsRef }) {
  const {  camera, target } = useThree();
  const { truckRef } = useConfiguratorStore();
  const highPolyLoaded = useConfiguratorStore(state => state.highPolyLoaded);

  useEffect(() => {
    if (!truckRef || highPolyLoaded) return;
  const box = new THREE.Box3().setFromObject(truckRef);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // target.set(center.x, center.y, center.z);

    camera.fov = 20;
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2) / 4.8);
    const offset = 0.5;

    camera.position.set(
      center.x + cameraDistance,
      box.max.y,
      center.z + cameraDistance * 1.4
    );
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(center.x, center.y-offset/2, center.z);
      controlsRef.current.update(); // apply the new target
    }
  }, [truckRef, camera, target, highPolyLoaded]);

  return null;
} 
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Box3, Vector3, Spherical } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import adamModel from '@/assets/adam.glb?url';

interface Model3DProps {
  glowRegion?: 'cardiovascular' | 'neurological' | 'respiratory' | 'musculoskeletal' | 'score' | null;
}

function Model({ glowRegion }: Model3DProps) {
  const { scene } = useGLTF(adamModel);
  
  // Clone the scene to avoid mutating the original
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Calculate bounding box and center the model
    const box = new Box3().setFromObject(cloned);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 5.5 / maxDim; // Scale to fit in view
    
    // Apply clinical, bright white appearance to materials
    cloned.traverse((child) => {
      if ((child as any).isMesh) {
        const material = (child as any).material.clone();
        material.transparent = true;
        material.opacity = 0.75;
        
        // Make material whiter and brighter - clinical appearance
        if (material.color) {
          // Increase brightness and whiteness
          material.color.setRGB(0.95, 0.95, 0.98); // Slightly cool white
          material.color.multiplyScalar(1.2); // Brighten
        }
        
        // Add subtle emissive glow for clinical brightness
        if (material.emissive !== undefined) {
          material.emissive.setRGB(0.15, 0.15, 0.18); // Subtle cool white glow
        }
        
        // Reduce roughness for cleaner, more clinical look
        if (material.roughness !== undefined) {
          material.roughness = Math.min(material.roughness * 0.6, 0.3);
        }
        
        // Reduce metalness to avoid realistic reflections
        if (material.metalness !== undefined) {
          material.metalness = Math.max(material.metalness * 0.3, 0.0);
        }
        
        (child as any).material = material;
      }
    });
    
    // Center and scale
    cloned.position.sub(center);
    cloned.scale.set(scale, scale, scale);
    // Move up a bit
    cloned.position.y += 2.0;
    
    return cloned;
  }, [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      rotation={[0, 0, 0]}
    />
  );
}

const STORAGE_KEY = 'model3d_azimuth';

function ControlsWithReset({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl> }) {
  const [shouldResetVertical, setShouldResetVertical] = useState(false);
  const defaultPolarAngle = Math.PI / 2.2; // ~82 degrees - tilted up view
  const spherical = useRef(new Spherical());
  const isResetting = useRef(false);
  const { camera } = useThree();
  const hasInitialized = useRef(false);

  // Initialize camera position with saved azimuth on mount
  useEffect(() => {
    if (controlsRef.current && !hasInitialized.current) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const savedAzimuth = parseFloat(saved);
          const radius = 6.5;
          const target = new Vector3(0, 2.0, 0);
          
          // Set camera position based on saved azimuth
          const offset = new Vector3().setFromSpherical(
            new Spherical(radius, defaultPolarAngle, savedAzimuth)
          );
          camera.position.copy(target.clone().add(offset));
          camera.lookAt(target);
          
          // Update controls to reflect this position
          controlsRef.current.update();
        }
      } catch (e) {
        // Ignore localStorage errors
      }
      hasInitialized.current = true;
    }
  }, [controlsRef, camera, defaultPolarAngle]);

  useFrame(() => {
    if (controlsRef.current && shouldResetVertical) {
      const controls = controlsRef.current;
      const camera = controls.object;
      
      if (!isResetting.current) {
        isResetting.current = true;
      }
      
      // Get current spherical coordinates
      const offset = camera.position.clone().sub(controls.target);
      spherical.current.setFromVector3(offset);
      
      // Smoothly interpolate polar angle back to default
      const targetPolar = defaultPolarAngle;
      const currentPolar = spherical.current.phi;
      const diff = targetPolar - currentPolar;
      
      if (Math.abs(diff) > 0.01) {
        // Smooth interpolation (easing)
        spherical.current.phi += diff * 0.15;
        
        // Preserve radius and azimuth
        const radius = spherical.current.radius;
        const azimuth = spherical.current.theta;
        
        // Update camera position
        const newOffset = new Vector3().setFromSpherical(
          new Spherical(radius, spherical.current.phi, azimuth)
        );
        camera.position.copy(controls.target.clone().add(newOffset));
        camera.lookAt(controls.target);
      } else {
        // Close enough, snap to target
        spherical.current.phi = targetPolar;
        const radius = spherical.current.radius;
        const azimuth = spherical.current.theta;
        const newOffset = new Vector3().setFromSpherical(
          new Spherical(radius, targetPolar, azimuth)
        );
        camera.position.copy(controls.target.clone().add(newOffset));
        camera.lookAt(controls.target);
        setShouldResetVertical(false);
        isResetting.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={true}
      minDistance={6.5}
      maxDistance={6.5}
      autoRotate={true}
      autoRotateSpeed={-3.5}
      rotateSpeed={0.5}
      target={[0, 2.0, 0]}
      onStart={() => {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = false;
          setShouldResetVertical(false);
          isResetting.current = false;
        }
      }}
      onEnd={() => {
        if (controlsRef.current) {
          // Save the current azimuth (horizontal rotation) to localStorage
          const controls = controlsRef.current;
          const camera = controls.object;
          const offset = camera.position.clone().sub(controls.target);
          const spherical = new Spherical().setFromVector3(offset);
          
          // Save azimuth to localStorage
          try {
            localStorage.setItem(STORAGE_KEY, spherical.theta.toString());
          } catch (e) {
            // Ignore localStorage errors (e.g., in private browsing)
          }
          
          controlsRef.current.autoRotate = true;
          setShouldResetVertical(true);
        }
      }}
    />
  );
}

function Model3D({ glowRegion }: Model3DProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  // Get saved azimuth from localStorage, default to 0 if not found
  const getInitialAzimuth = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return parseFloat(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 0;
  };
  
  const initialAzimuth = getInitialAzimuth();
  const defaultPolarAngle = Math.PI / 2.2; // ~82 degrees - tilted up view
  const radius = 6.5;
  
  // Calculate initial camera position from saved azimuth
  const initialOffset = new Vector3().setFromSpherical(
    new Spherical(radius, defaultPolarAngle, initialAzimuth)
  );
  const initialCameraPosition = initialOffset.toArray() as [number, number, number];

  return (
    <div 
      className="w-[340px] h-[340px] relative transition-all duration-200 drop-shadow-[0_0_25px_hsl(var(--primary)/0.3)]"
    >
      <Canvas
        camera={{ position: initialCameraPosition, fov: 50 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
      >
        <Suspense fallback={null}>
          {/* Lighting - enhanced for clinical brightness */}
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, -5, -5]} intensity={0.6} />
          <directionalLight position={[0, 10, 0]} intensity={0.8} />
          
          {/* Model */}
          <Model glowRegion={glowRegion} />
          
          {/* Controls */}
          <ControlsWithReset controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload(adamModel);

export default Model3D;

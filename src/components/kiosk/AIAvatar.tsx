import { useMemo } from "react";
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Box3, Vector3 } from 'three';
import aiAssistantModel from '@/assets/ai_assistant.glb?url';

interface AIAvatarProps {
  mood?: "neutral" | "happy" | "concerned" | "speaking";
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

function Model3D() {
  const { scene } = useGLTF(aiAssistantModel);
  
  // Clone the scene to avoid mutating the original
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Calculate bounding box and center the model
    const box = new Box3().setFromObject(cloned);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = (1.0 / maxDim); // Scale to fit in view, made a bit bigger
    
    // Apply white appearance to materials
    cloned.traverse((child) => {
      if ((child as any).isMesh) {
        const material = (child as any).material.clone();
        material.transparent = true;
        material.opacity = 0.9;
        
        // Make material whiter and brighter
        if (material.color) {
          material.color.setRGB(0.98, 0.98, 1.0); // Very light blue-white
          material.color.multiplyScalar(1.5); // Brighten
        }
        
        // Add emissive glow for whiter appearance
        if (material.emissive !== undefined) {
          material.emissive.setRGB(0.3, 0.3, 0.35); // Cool white glow
        }
        
        // Reduce roughness for cleaner, whiter look
        if (material.roughness !== undefined) {
          material.roughness = Math.min(material.roughness * 0.5, 0.2);
        }
        
        // Reduce metalness to avoid realistic reflections
        if (material.metalness !== undefined) {
          material.metalness = Math.max(material.metalness * 0.2, 0.0);
        }
        
        (child as any).material = material;
      }
    });
    
    // Center and scale
    cloned.position.sub(center);
    cloned.scale.set(scale, scale, scale);
    
    return cloned;
  }, [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      rotation={[0.3, 0.3, 0]}
    />
  );
}

const AIAvatar = ({ 
  mood = "neutral", 
  size = "md", 
  animate = false,
  className = ""
}: AIAvatarProps) => {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-24 h-24",
    lg: "w-36 h-36",
    xl: "w-44 h-44"
  };

  const moodColors = {
    neutral: {
      primary: "hsl(180 100% 50%)",
      secondary: "hsl(200 100% 60%)"
    },
    happy: {
      primary: "hsl(150 100% 45%)",
      secondary: "hsl(180 100% 50%)"
    },
    concerned: {
      primary: "hsl(40 100% 55%)",
      secondary: "hsl(30 100% 50%)"
    },
    speaking: {
      primary: "hsl(190 100% 55%)",
      secondary: "hsl(200 100% 60%)"
    }
  };

  const colors = moodColors[mood];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Model container */}
      <div 
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
        style={{
          boxShadow: '0 2px 8px hsl(0 0% 0% / 0.15), 0 1px 3px hsl(0 0% 0% / 0.1)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 1.7], fov: 50 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, -5, -5]} intensity={0.8} />
            <directionalLight position={[0, 10, 0]} intensity={1.0} />
            <Model3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Speaking indicator - static dots, no bounce */}
      {mood === "speaking" && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span 
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ 
                background: colors.primary,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Preload the model
useGLTF.preload(aiAssistantModel);

export default AIAvatar;

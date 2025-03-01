import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Box } from '@react-three/drei';
import { BBModelFile, BBModelElement } from '../../types';

interface ModelViewerProps {
  modelData?: BBModelFile;
  previewUrl?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelData, previewUrl }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modelData || previewUrl) {
      setIsLoading(false);
    }
  }, [modelData, previewUrl]);

  // If we only have a preview image, show that
  if (previewUrl && !modelData) {
    return (
      <div style={{ width: '100%', height: '400px', position: 'relative' }}>
        <img 
          src={previewUrl} 
          alt="Model Preview" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
          }} 
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      {isLoading ? (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px'
        }}>
          Loading model...
        </div>
      ) : error ? (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          color: 'red'
        }}>
          {error}
        </div>
      ) : (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls />
          <Grid infiniteGrid fadeDistance={30} fadeStrength={5} />
          
          {/* Render model elements if available */}
          {modelData && modelData.elements && modelData.elements.map((element: BBModelElement) => (
            <ElementMesh key={element.uuid} element={element} />
          ))}
          
          {/* Fallback if no model data */}
          {(!modelData || !modelData.elements || modelData.elements.length === 0) && (
            <Box args={[2, 2, 2]}>
              <meshStandardMaterial color="hotpink" />
            </Box>
          )}
        </Canvas>
      )}
    </div>
  );
};

// Component to render a single element from the bbmodel
const ElementMesh: React.FC<{ element: BBModelElement }> = ({ element }) => {
  // Extract position from the element
  const position = element.origin || [0, 0, 0];
  const rotation = element.rotation || [0, 0, 0];
  
  // Convert rotation from degrees to radians
  const rotationRadians = rotation.map(deg => (deg * Math.PI) / 180);
  
  // For cube elements, we can use the Box component
  if (element.type === 'cube') {
    // Calculate size and position based on "from" and "to" properties
    // This is a simplified approach - in a real implementation you'd need to handle all the bbmodel properties
    const from = (element as any).from || [-1, -1, -1];
    const to = (element as any).to || [1, 1, 1];
    
    const size = [
      Math.abs(to[0] - from[0]),
      Math.abs(to[1] - from[1]),
      Math.abs(to[2] - from[2])
    ];
    
    const centerPosition = [
      position[0] + (from[0] + to[0]) / 2,
      position[1] + (from[1] + to[1]) / 2,
      position[2] + (from[2] + to[2]) / 2
    ];
    
    return (
      <Box args={size} position={centerPosition} rotation={rotationRadians}>
        <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
      </Box>
    );
  }
  
  // For other element types, we'd need more complex handling
  return null;
};

export default ModelViewer;
"use client";

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';

const Cube = ({ position, color, letter, onClick, isSelected }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef} 
        onClick={onClick}
        scale={isSelected ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {letter}
      </Text>
    </group>
  );
};

const CubeGrid = ({ selectedCube, setSelectedCube, setTargetPosition }) => {
  const cubes = [];
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let letterIndex = 0;
  
  // Create a 3x3 grid of cubes
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const position = [x * 2 - 2, y * 2 - 2, z * 2 - 2];
        const color = colors[(x + y + z) % colors.length];
        const id = `${x}-${y}-${z}`;
        const letter = letters[letterIndex++];
        
        cubes.push({
          id,
          position,
          color,
          letter,
          isSelected: selectedCube?.id === id
        });
      }
    }
  }

  return (
    <>
      {cubes.map((cube) => (
        <Cube
          key={cube.id}
          position={cube.position}
          color={cube.color}
          letter={cube.letter}
          isSelected={cube.isSelected}
          onClick={() => {
            console.log(`Clicked cube with letter: ${cube.letter}`);
            
            if (selectedCube?.id === cube.id) {
              setSelectedCube(null); // Deselect if clicking same cube
            } else if (selectedCube) {
              setTargetPosition(cube.position); // Set target for movement
            } else {
              setSelectedCube({ id: cube.id, position: cube.position, letter: cube.letter });
            }
          }}
        />
      ))}
    </>
  );
};

const MovingCube = ({ cube, targetPosition, duration, onComplete }) => {
  const meshRef = useRef();
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (progress < 1 && targetPosition) {
      const newProgress = Math.min(progress + delta / duration, 1);
      setProgress(newProgress);
      
      if (meshRef.current) {
        meshRef.current.position.lerpVectors(
          new THREE.Vector3(...cube.position),
          new THREE.Vector3(...targetPosition),
          newProgress
        );
      }

      if (newProgress >= 1) {
        onComplete();
      }
    }
  });

  return (
    <group ref={meshRef} position={cube.position}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {cube.letter}
      </Text>
    </group>
  );
};

const Scene = () => {
  const [selectedCube, setSelectedCube] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);
  const [movingCube, setMovingCube] = useState(null);
  
  const handleMoveComplete = () => {
    console.log(`Moved cube ${movingCube.letter} to new position`);
    setMovingCube(null);
    setSelectedCube(null);
    setTargetPosition(null);
  };

  useEffect(() => {
    if (selectedCube && targetPosition) {
      setMovingCube({
        ...selectedCube,
        targetPosition,
        duration: 1 // seconds
      });
    }
  }, [selectedCube, targetPosition]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <CubeGrid 
        selectedCube={selectedCube} 
        setSelectedCube={setSelectedCube}
        setTargetPosition={setTargetPosition}
      />
      
      {movingCube && (
        <MovingCube
          cube={movingCube}
          targetPosition={movingCube.targetPosition}
          duration={movingCube.duration}
          onComplete={handleMoveComplete}
        />
      )}
    </>
  );
};

const Cube3DModel = () => {
  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Scene />
      </Canvas>
      <div className="p-4 text-white">
        <p className="text-center">
          Click a cube to select it (letter will log to console), then click another position to move it.
        </p>
      </div>
    </div>
  );
};

export default Cube3DModel;
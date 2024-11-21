// import "hojas-de-estilo/cambio-sillas.css";
import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { MapControls, Text } from "@react-three/drei";

export function CambioSillas() {
  const chairs = [];
  const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
  for (let i = 1; i <= 250; i++) {
    const record = {
        id_silla: i,
        id_vuelo: Math.floor(Math.random() * 100) + 101,
        ubicacion: i,
        clase: randomChoice(["E", "P"]),
        estado: randomChoice(["L", "R", "O"]),
    };
    chairs.push(record);
  }
  const colors = {
    "L":"#00d221",
    "O":"red",
    "R":"yellow"
  }
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const toggleAsiento = useCallback((asientoId) => {
    setSelectedSeat(prevSelected => prevSelected === asientoId ? null : asientoId);
  }, []);

  function Box({ position, size, color, ubication }) {
    const objRef = useRef()
    const isSelected = selectedSeat === ubication;
  
    const handleClick = () => {
      toggleAsiento(ubication);
      if(!isSelected){
        objRef.current.scale.z += 2;
      }else{
        objRef.current.scale.z = 1;
      }
    } 

    useFrame((state, delta) => {
      if (objRef.current && !animationComplete) {
        if (objRef.current.position.y > position[1]) {
          objRef.current.position.y -= 0.05;
        } else {
          setAnimationComplete(true);
        }
      }
    });
  
    return (
      <group name={ubication} ref={objRef} position={[position[0], animationComplete ? position[1] : position[1]+11, position[2]]} onClick={handleClick}>
        <mesh>
          <boxGeometry args={size} />
          <meshStandardMaterial 
            color={isSelected ? "#2EB6C1" : color}
            emissive={isSelected ? "#2EB6C1" : "black"}
            emissiveIntensity={isSelected ? 1 : 0}
          />
        </mesh>
        <Text
          position={[0, -0.05, 0.01]}
          fontSize={0.05}
          color="black"
          anchorX="center"
          anchorY="center"
        >
          {ubication}
        </Text>
      </group>
    );
  }

  const Scene = () => {
    const objRef = useRef();
    const materials = useLoader(MTLLoader, "wingcol-airplane.mtl");
    const obj = useLoader(OBJLoader, "wingcol-airplane.obj", (loader) => {
      materials.preload();
      loader.setMaterials(materials);
    });
  
    useFrame(() => {
      if (objRef.current && !animationComplete) {
        if (objRef.current.rotation.y < Math.PI / 2) {
          objRef.current.rotation.y += Math.PI / 400;
        }
        if (objRef.current.rotation.z < Math.PI / 2) {
          objRef.current.rotation.z += Math.PI / 400;
        }
        if (objRef.current.position.z < 2) {
          objRef.current.position.z += 0.05;
        }
        if (objRef.current.position.x < -3) {
          objRef.current.position.x += 0.05;
        }
      }
    });
    return <primitive ref={objRef} object={obj} position={animationComplete ? [-3, 0, 2] : [-5, 0, -8]} scale={0.4} />;
  };

  return (
    <div className="App">
      <Canvas>
        <Suspense fallback={null}>
          {chairs.map((item, index) => {
            let groupIndex = Math.floor(index / 6);
            let positionY = 0.5 - (index % 6) * 0.16;
            let positionX = 0.5 - groupIndex * 0.15;
            if(index%6 >= 3){
              positionY-=0.15
            }
            let rowLabel = String.fromCharCode(65 + index%6);
            let colLabel = groupIndex + 1;

            return (
              <Box
                key={index}
                size={[0.1, 0.1, 0.01]}
                position={[positionX, positionY, 3.8]}
                color={colors[item.estado]}
                ubication={rowLabel+colLabel}
              />
            );
          })}
          <Scene />
          <MapControls makeDefault/>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
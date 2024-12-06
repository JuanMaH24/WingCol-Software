// import "hojas-de-estilo/cambio-sillas.css";
import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { MapControls, Text } from "@react-three/drei";

export function CambioSillas({id_vuelo, selectedSeat, setSelectedSeat, setGlobalSeats}) {
  const [seats, setSeats] = useState([]);
  const location = useLocation();
  console.log("TIENES AGUA FRESCA EN UN JARRÓN")
  // console.log(setSelectedSeat);
  // const id_vuelo = location.state?.id_vuelo
  // const selectedSeat = location.state?.selectedSeat
  // const setSelectedSeat = location.state?.setSelectedSeat
  // const setGlobalSeats = location.state?.setGlobalSeats
  const apiHost = import.meta.env.VITE_API_HOST;
  const jwtToken = localStorage.getItem("access");
  // console.log(id_vuelo, selectedSeat, setSelectedSeat, setGlobalSeats);
  // const currentUser = getUser();
  useEffect(() => {
    // Aquí deberías hacer una llamada al backend para obtener los datos del usuario
    async function fetchSeats() {
      try {
        const param = new URLSearchParams({id_vuelo: id_vuelo});
        const response = await fetch(
          `${apiHost}/checkin/seat/get/?${param.toString()}`,{
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const allSeats = await response.json();
        if (Array.isArray(allSeats)){
          setSeats(allSeats);
          setGlobalSeats(allSeats);
        }
      } catch (error) {
        console.error("Error al cargar las sillas", error);
      }
    }  
    fetchSeats();
  }, [id_vuelo, setGlobalSeats]);

  const colors = {
    "L":"#00d221",
    "O":"red",
    "R":"yellow",
    "Me": "blue"
  }
  // const [selectedSeat, setSelectedSeat] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const toggleAsiento = useCallback((asientoId) => {
    setSelectedSeat(prevSelected => prevSelected === asientoId ? null : asientoId);
  }, []);

  function Box({ position, size, color, ubication, seat, state }) {
    const objRef = useRef()
    const isSelected = selectedSeat === seat;
  
    const handleClick = () => {
      toggleAsiento(seat);
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
      <group name={ubication} ref={objRef} position={[position[0], animationComplete ? position[1] : position[1]+11, position[2]]} onClick={state ? handleClick : null}>
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
        if (objRef.current.position.x < -4) {
          objRef.current.position.x += 0.05;
        }
      }
    });
    return <primitive ref={objRef} object={obj} position={animationComplete ? [-4, 0, 2] : [-6, 0, -8]} scale={0.4} />;
  };

  return (
    <div className="CambioSillas">
      <Canvas>
        <Suspense fallback={null}>
          {seats.map((item, index) => {
            let groupIndex = Math.floor(index / 6);
            let positionY = 0.5 - (index % 6) * 0.16;
            let positionX = -0.5 - groupIndex * 0.15;
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
                color={colors[ selectedSeat == item.id_silla ? "Me" : item.estado]}
                ubication={rowLabel+colLabel}
                state={item.estado=="L"}
                seat={item}
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
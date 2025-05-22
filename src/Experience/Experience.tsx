import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { AxesHelper } from 'three'
import './styles.css'
import { Dimension } from '../../src-tauri/bindings/Dimension'
import Triangle from './Triangle'
import { Triangle3 } from '../../src-tauri/bindings/Triangle3'

function Vertices() {
  const dimension = useSelector((state: any) => state.vertexSettings.dimension) as Dimension;
  const vertices = useSelector((state: any) => state.vertexSettings.vertices);

  const points = useMemo(() => {
    const points = new Float32Array(vertices.length * 3)
    for (let i = 0; i < vertices.length; i++) {
      const i3 = i * 3
      points[i3] = vertices[i].x
      points[i3 + 1] = vertices[i].y
      points[i3 + 2] = vertices[i].z
    }
    return points
  }, [vertices, dimension])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length}
          array={points}
          itemSize={3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" />
    </points>
  )
}

export default function Experience() {
  const vertices = useSelector((state: any) => state.vertexSettings.vertices);
  const triangles = useSelector((state: any) => state.vertexSettings.triangles);
  const gridActive = useSelector((state: any) => state.experienceSettings.gridActive)
  const axisActive = useSelector((state: any) => state.experienceSettings.axisActive)

  return (
    <Canvas
      className='container'
      camera={{
        position: [5, 5, 5],
        fov: 75,
        near: 0.1,
        far: 1000
      }}
    >
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />
      {gridActive && <Grid infiniteGrid position={[0, -0.001, 0]} />}
      {axisActive && <primitive object={new AxesHelper(5)} />}
      {vertices.length > 0 && <Vertices />}
      {triangles.length > 0 && triangles.map((triangle: Triangle3, index: number) => <Triangle key={index} triangle={triangle} />)}
    </Canvas>
  );
}
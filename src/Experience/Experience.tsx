import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { AxesHelper } from 'three'
import './styles.css'
import { Dimension } from '../types'

function Vertices({ count, mode }: { count: number; mode: Dimension }) {
  const points = useMemo(() => {
    const points = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      points[i3] = (Math.random() - 0.5) * 10
      points[i3 + 1] = mode === Dimension.TwoD ? 0 : (Math.random() - 0.5) * 10
      points[i3 + 2] = (Math.random() - 0.5) * 10
    }
    return points
  }, [count, mode])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" />
    </points>
  )
}

interface ExperienceProps {
  vertexCount: number;
  mode: Dimension;
}

export default function Experience({ vertexCount, mode }: ExperienceProps) {
  const gridActive = useSelector((state: any) => state.gridActive)
  const axisActive = useSelector((state: any) => state.axisActive)

  return (
    <Canvas className='container'>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />
      {gridActive && <Grid infiniteGrid />}
      {axisActive && <primitive object={new AxesHelper(5)} />}
      {vertexCount > 0 && <Vertices count={vertexCount} mode={mode} />}
    </Canvas>
  );
}
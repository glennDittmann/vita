import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import './styles.css'

function Vertices({ count }: { count: number }) {
  const points = useMemo(() => {
    const points = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      points[i3] = (Math.random() - 0.5) * 10
      points[i3 + 1] = (Math.random() - 0.5) * 10
      points[i3 + 2] = (Math.random() - 0.5) * 10
    }
    return points
  }, [count])

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
}

export default function Experience({ vertexCount }: ExperienceProps) {
  return (
    <Canvas className='container'>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {vertexCount > 0 && <Vertices count={vertexCount} />}
    </Canvas>
  );
}
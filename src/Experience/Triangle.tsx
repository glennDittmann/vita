import { useMemo } from "react";
import { Triangle3 } from "../../src-tauri/bindings/Triangle3";
import * as THREE from "three";

export default function Triangle({ triangle }: { triangle: Triangle3 }) {
  const f32Array = useMemo(() =>
    Float32Array.from(
      [
        triangle.a.x, triangle.a.y, triangle.a.z,
        triangle.b.x, triangle.b.y, triangle.b.z,
        triangle.c.x, triangle.c.y, triangle.c.z
      ]
    ), [triangle]
  )

  const lineSegmentsArray = useMemo(() =>
    Float32Array.from(
      [
        triangle.a.x, triangle.a.y, triangle.a.z,
        triangle.b.x, triangle.b.y, triangle.b.z,

        triangle.b.x, triangle.b.y, triangle.b.z,
        triangle.c.x, triangle.c.y, triangle.c.z,

        triangle.c.x, triangle.c.y, triangle.c.z,
        triangle.a.x, triangle.a.y, triangle.a.z,
      ]
    ), [triangle]
  )

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[f32Array, 3]}
          />
        </bufferGeometry>
        <meshBasicMaterial
          color={new THREE.Color(0x156289)}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[lineSegmentsArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={new THREE.Color(0xffffff)}
          transparent
          opacity={0.5}
        />
      </lineSegments>
    </>
  )
}
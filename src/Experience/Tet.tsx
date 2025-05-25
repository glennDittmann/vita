import { useMemo, useRef, useEffect } from "react";
import { Tetrahedron3 } from "../../src-tauri/bindings/Tetrahedron3";
import * as THREE from "three";

/** A Tetrahedron that is created from four vertices. */
export default function Tet({ tetrahedron }: { tetrahedron: Tetrahedron3 }) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() =>
    Float32Array.from(
      [
        tetrahedron.a.x, tetrahedron.a.y, tetrahedron.a.z,
        tetrahedron.b.x, tetrahedron.b.y, tetrahedron.b.z,
        tetrahedron.c.x, tetrahedron.c.y, tetrahedron.c.z,
        tetrahedron.d.x, tetrahedron.d.y, tetrahedron.d.z
      ]
    ), [tetrahedron]
  );

  const indices = useMemo(() =>
    Uint16Array.from([
      0, 1, 2, // Face 1
      0, 1, 3, // Face 2
      0, 2, 3, // Face 3
      1, 2, 3  // Face 4
    ]
    ), [tetrahedron]
  );

  // Compute vertex normals after geometry is created
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.computeVertexNormals();
    }
  }, [positions, indices]);

  return (
    <>
      {/* Tetrahedron */}
      <mesh>
        <bufferGeometry ref={geometryRef} attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[indices, 1]}
          />
        </bufferGeometry>
        <meshPhongMaterial
          color={new THREE.Color(0x156289)}
          emissive={new THREE.Color(0x072534)}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tetrahedron Edges */}
      <lineSegments>
        <bufferGeometry ref={geometryRef} attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[indices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={new THREE.Color(0xffffff)} transparent opacity={0.5} />
      </lineSegments>
    </>
  )
}
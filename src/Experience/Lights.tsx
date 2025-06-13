export default function Lights() {
	return (
		<>
			{/* 
        These are the lights used in the Three.js examples,
        e.g. from the docs: https://threejs.org/docs/#api/en/geometries/TetrahedronGeometry
      
        Defined here: https://github.com/mrdoob/three.js/blob/dev/docs/scenes/geometry-browser.html (line 754 ff.)
      */}
			<directionalLight position={[0, 20, 0]} intensity={3.0} />
			<directionalLight position={[10, 20, 10]} intensity={3.0} />
			<directionalLight position={[-10, -20, -10]} intensity={3.0} />
		</>
	);
}

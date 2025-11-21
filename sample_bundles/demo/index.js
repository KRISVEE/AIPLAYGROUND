/**
 * This script is executed by the Player.
 * It receives the Three.js 'scene' and 'time' as arguments.
 * It returns an object with an 'update(delta)' function.
 */
export default function initScene(THREE, scene) {
    // 1. Create Geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x6366f1,
        roughness: 0.2,
        metalness: 0.5
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 2. Add Lights
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(2, 5, 2);
    scene.add(light);
    
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    // 3. Add Grid
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    // 4. Return the update loop
    return {
        update: (delta, time) => {
            cube.rotation.x += 1.0 * delta;
            cube.rotation.y += 0.5 * delta;
            
            // Simple hover effect
            cube.position.y = 1 + Math.sin(time * 2) * 0.2;
        },
        dispose: () => {
            geometry.dispose();
            material.dispose();
        }
    };
}
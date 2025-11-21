import * as THREE from 'three';

// --- SETUP ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
// Add a bit of fog for depth
scene.fog = new THREE.FogExp2(0x050508, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Clamp pixel ratio for performance

// --- LAYER 1: STARFIELD ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100; // Spread wider
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.6,
});
const starMesh = new THREE.Points(particlesGeometry, starMaterial);
scene.add(starMesh);

// --- LAYER 2: THE "CYBER CORE" (About Section) ---
const aboutGroup = new THREE.Group();
scene.add(aboutGroup);

// 1. Central Brain (Icosahedron)
const coreGeo = new THREE.IcosahedronGeometry(4, 1);
const coreMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
aboutGroup.add(coreMesh);

// 2. Floating Rings
const ringGeo = new THREE.TorusGeometry(6, 0.05, 16, 100);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });

const ring1 = new THREE.Mesh(ringGeo, ringMat);
ring1.rotation.x = Math.PI / 2;
aboutGroup.add(ring1);

const ring2 = new THREE.Mesh(ringGeo, ringMat);
ring2.rotation.y = Math.PI / 2;
ring2.scale.set(1.2, 1.2, 1.2);
aboutGroup.add(ring2);

// 3. Orbiting Particles
const orbitGeo = new THREE.BufferGeometry();
const orbitCount = 50;
const orbitPos = new Float32Array(orbitCount * 3);
for(let i=0; i<orbitCount*3; i++){
    orbitPos[i] = (Math.random() - 0.5) * 15;
}
orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
const orbitMat = new THREE.PointsMaterial({ color: 0xff3366, size: 0.2 });
const orbitMesh = new THREE.Points(orbitGeo, orbitMat);
aboutGroup.add(orbitMesh);

// Initial Position (Hidden)
aboutGroup.position.set(-20, 0, 0);
aboutGroup.visible = false;

// --- INPUT HANDLING ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

const animate = () => {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Global Animation
    starMesh.rotation.y = elapsedTime * 0.02;

    // 2. Scroll Detection for About Section
    const aboutSection = document.getElementById('about');
    if(aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Is it visible?
        if(rect.top < viewHeight && rect.bottom > 0) {
            aboutGroup.visible = true;

            // Calculate Scroll Progress (0 = bottom, 1 = top)
            const progress = 1 - (rect.top / viewHeight);
            
            // Smoothly enter: Start at x=-30, end at x=-8 (Desktop) or x=0 (Mobile)
            const targetGroupX = (window.innerWidth < 900) ? 0 : -8; 
            const currentX = THREE.MathUtils.lerp(-30, targetGroupX, Math.min(Math.max(progress, 0), 1));
            aboutGroup.position.x = currentX;

            // Mouse Interaction (Parallax)
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            aboutGroup.rotation.y += 0.5 * delta; // Spin
            aboutGroup.rotation.x += 0.05 * (targetY - aboutGroup.rotation.x); // Tilt

            // Sub-animations
            ring1.rotation.x += delta * 0.5;
            ring2.rotation.x -= delta * 0.3;
            
            // Pulse
            const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
            coreMesh.scale.set(scale, scale, scale);
        } else {
            aboutGroup.visible = false;
        }
    }

    // 3. Camera Parallax
    camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
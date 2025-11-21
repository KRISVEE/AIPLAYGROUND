import * as THREE from 'three';

export class ThreePlayer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.contentScript = null; // The loaded game logic
        
        this.isPlaying = false;
        this.animationId = null;
        this.clock = new THREE.Clock();
        
        this.initEngine();
    }

    initEngine() {
        // Basic Three.js Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // Resize handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    async loadBundle(manifest, scriptPath) {
        this.reset();

        // Apply Manifest Config
        if(manifest.runtime) {
            const { cameraPosition, backgroundColor } = manifest.runtime;
            if(cameraPosition) this.camera.position.set(...cameraPosition);
            if(backgroundColor) this.scene.background = new THREE.Color(backgroundColor);
        }

        // Load the Content Script dynamically
        try {
            const module = await import(`../${scriptPath}`);
            // We expect the default export to be an init function
            // We inject THREE and scene so the script doesn't need to import them
            this.contentScript = module.default(THREE, this.scene);
            
            this.play();
        } catch (err) {
            console.error("Failed to load bundle script:", err);
            alert("Error loading content bundle.");
        }
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.clock.start();
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        this.clock.stop();
        if(this.animationId) cancelAnimationFrame(this.animationId);
    }

    reset() {
        this.pause();
        // Cleanup existing objects
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }
        if(this.contentScript && this.contentScript.dispose) {
            this.contentScript.dispose();
        }
        this.contentScript = null;
    }

    animate() {
        if (!this.isPlaying) return;

        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // Run the bundle's update logic
        if(this.contentScript && this.contentScript.update) {
            this.contentScript.update(delta, time);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    dispose() {
        this.reset();
        this.container.innerHTML = '';
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
}
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeHeroScene
 * Interactive 3D WebGL Canvas displaying:
 * 1. 3D Floating Holographic Medical Emblem (Cross & Heart)
 * 2. 3D Department Orbiting Beacons (Cardiology, Orthopedics, Pediatrics, Neurology, Dermatology)
 * 3. 1000+ Floating Cyber-Medical Particles with mouse parallax
 * 4. Interactive Raycasting: Click 3D beacons to filter OPD doctors!
 */
export default function ThreeHeroScene({ selectedSpecialty, onSelectSpecialty }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    let width = currentMount.clientWidth || window.innerWidth;
    let height = currentMount.clientHeight || 440;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x38bdf8, 3, 25);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const tealLight = new THREE.PointLight(0x0d9488, 3.5, 25);
    tealLight.position.set(-5, -3, 3);
    scene.add(tealLight);

    const redAccent = new THREE.PointLight(0xef4444, 2, 20);
    redAccent.position.set(0, 3, -2);
    scene.add(redAccent);

    // ==========================================
    // 1. CENTRAL 3D MEDICAL CROSS WITH HEARTBEAT
    // ==========================================
    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    // Cross material (Glowing translucent cyan)
    const crossMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92
    });

    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.8, 0.45), crossMat);
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.45), crossMat);
    centerGroup.add(vBar);
    centerGroup.add(hBar);

    // Outer Holographic Torus Ring
    const torusGeo = new THREE.TorusGeometry(1.4, 0.035, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.55 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    centerGroup.add(torus);

    const innerTorusGeo = new THREE.TorusGeometry(1.05, 0.02, 16, 48);
    const innerTorusMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.6 });
    const innerTorus = new THREE.Mesh(innerTorusGeo, innerTorusMat);
    innerTorus.rotation.y = Math.PI / 4;
    centerGroup.add(innerTorus);

    // ==========================================
    // 2. ORBITING DEPARTMENT BEACONS (INTERACTIVE)
    // ==========================================
    const departments = [
      { name: 'Cardiology', color: 0xef4444, angle: 0, distance: 3.2, y: 0.2, label: '❤️ Heart' },
      { name: 'Orthopedics', color: 0x8b5cf6, angle: (Math.PI * 2) / 5, distance: 3.3, y: -0.4, label: '🦴 Ortho' },
      { name: 'Pediatrics', color: 0x0d9488, angle: (Math.PI * 4) / 5, distance: 3.1, y: 0.5, label: '👶 Child' },
      { name: 'Neurology', color: 0xf59e0b, angle: (Math.PI * 6) / 5, distance: 3.4, y: -0.3, label: '🧠 Neuro' },
      { name: 'Dermatology', color: 0x10b981, angle: (Math.PI * 8) / 5, distance: 3.2, y: 0.4, label: '🌿 Skin' },
    ];

    const beaconMeshes = [];
    departments.forEach((dept) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.userData = { deptName: dept.name, label: dept.label };

      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: dept.color,
        emissive: dept.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.7
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      beaconGroup.add(sphere);

      // Orbital pulse ring around sphere
      const ringGeo = new THREE.RingGeometry(0.42, 0.48, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: dept.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      beaconGroup.add(ring);

      beaconGroup.position.x = Math.cos(dept.angle) * dept.distance;
      beaconGroup.position.z = Math.sin(dept.angle) * dept.distance;
      beaconGroup.position.y = dept.y;

      beaconGroup.userData.originalY = dept.y;
      beaconGroup.userData.angle = dept.angle;
      beaconGroup.userData.distance = dept.distance;
      beaconGroup.userData.sphere = sphere;

      scene.add(beaconGroup);
      beaconMeshes.push(beaconGroup);
    });

    // ==========================================
    // 3. FLOATING BIO-PARTICLES
    // ==========================================
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // Cyan to Teal palette
      const isTeal = Math.random() > 0.5;
      colors[i * 3] = isTeal ? 0.05 : 0.2;
      colors[i * 3 + 1] = isTeal ? 0.7 : 0.8;
      colors[i * 3 + 2] = 0.95;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // 4. MOUSE PARALLAX & RAYCASTING
    // ==========================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.8;
      mouse.targetY = y * 0.4;
      mouseVector.x = x;
      mouseVector.y = y;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let hit of intersects) {
        let parent = hit.object.parent;
        while (parent && parent !== scene) {
          if (parent.userData && parent.userData.deptName) {
            onSelectSpecialty(parent.userData.deptName);
            return;
          }
          parent = parent.parent;
        }
      }
    };

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      width = currentMount.clientWidth;
      height = currentMount.clientHeight || 440;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 5. ANIMATION LOOP
    // ==========================================
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x * 2;
      camera.position.y = 1.5 + mouse.y * 1.5;
      camera.lookAt(0, 0, 0);

      // Central Heartbeat Pulse simulation
      const beat = Math.sin(elapsedTime * 3.5);
      const pulseScale = 1.0 + Math.max(0, beat) * 0.08;
      centerGroup.scale.set(pulseScale, pulseScale, pulseScale);
      centerGroup.rotation.y = elapsedTime * 0.4;
      torus.rotation.z = elapsedTime * 0.5;
      innerTorus.rotation.x = -elapsedTime * 0.6;

      // Orbit department beacons
      beaconMeshes.forEach((beacon) => {
        const u = beacon.userData;
        const currentAngle = u.angle + elapsedTime * 0.25;
        beacon.position.x = Math.cos(currentAngle) * u.distance;
        beacon.position.z = Math.sin(currentAngle) * u.distance;
        beacon.position.y = u.originalY + Math.sin(elapsedTime * 2 + u.angle) * 0.15;
        beacon.rotation.y = elapsedTime * 0.8;

        // Highlight if matches selected specialty
        if (selectedSpecialty && selectedSpecialty.toLowerCase() === u.deptName.toLowerCase()) {
          beacon.scale.set(1.4, 1.4, 1.4);
          u.sphere.material.emissiveIntensity = 1.2;
        } else {
          beacon.scale.set(1.0, 1.0, 1.0);
          u.sphere.material.emissiveIntensity = 0.5;
        }
      });

      // Drift particles gently
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('click', handleClick);
        if (renderer.domElement && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, [selectedSpecialty, onSelectSpecialty]);

  return (
    <div className="three-hero-container">
      <div className="three-canvas-wrap" ref={mountRef}></div>
      <div className="three-overlay-info">
        <div className="three-hud-pill">
          <span className="live-radar-dot"></span>
          <span>WebGL 3D OPD Campus Navigator • Click Orbiting Dept Nodes to Filter</span>
        </div>
      </div>
    </div>
  );
}

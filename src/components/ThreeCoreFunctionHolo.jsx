import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeCoreFunctionHolo
 * 3D WebGL Holographic Reticle / Ring for Requirement 2 (Core Function - Circled and Labelled)
 * Renders an interactive 3D animated crimson targeting ring with laser coordinates.
 */
export default function ThreeCoreFunctionHolo({ isActive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || !isActive) return;

    const width = currentMount.clientWidth || 320;
    const height = currentMount.clientHeight || 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 3D Crimson Targeting Ring (Circled representation)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Primary Torus Ring (The Circle)
    const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.85
    });
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    ringGroup.add(mainRing);

    // Segmented Outer Tech Ring
    const outerGeo = new THREE.RingGeometry(1.8, 1.88, 32, 1, 0, Math.PI * 1.5);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xf87171,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const outerSegment = new THREE.Mesh(outerGeo, outerMat);
    ringGroup.add(outerSegment);

    // 4 Corner 3D Crosshair Reticles
    const crossMat = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 });
    const crossLength = 0.3;
    const offsets = [
      [-1.6, 0], [1.6, 0], [0, -1.6], [0, 1.6]
    ];

    offsets.forEach(([ox, oy]) => {
      const points = [
        new THREE.Vector3(ox - crossLength / 2, oy, 0),
        new THREE.Vector3(ox + crossLength / 2, oy, 0),
        new THREE.Vector3(ox, oy - crossLength / 2, 0),
        new THREE.Vector3(ox, oy + crossLength / 2, 0)
      ];
      const crossGeo = new THREE.BufferGeometry().setFromPoints(points);
      const crossLine = new THREE.LineSegments(crossGeo, crossMat);
      ringGroup.add(crossLine);
    });

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Continuous 3D rotation & pulsing
      ringGroup.rotation.z = t * 0.4;
      ringGroup.rotation.x = Math.sin(t * 0.8) * 0.15;
      ringGroup.rotation.y = Math.cos(t * 0.6) * 0.15;

      const scale = 1.0 + Math.sin(t * 2) * 0.04;
      ringGroup.scale.set(scale, scale, scale);

      outerSegment.rotation.z = -t * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="three-core-holo-wrapper" ref={mountRef} title="3D WebGL Holographic Reticle: Core Function"></div>
  );
}

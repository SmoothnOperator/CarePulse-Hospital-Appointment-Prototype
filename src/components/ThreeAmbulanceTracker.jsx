import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ThreeAmbulanceTracker
 * 3D WebGL Live Ambulance Dispatch & Route Simulation Scene
 * Shows high-speed road motion, 3D ambulance vehicle, flashing red/blue emergency sirens,
 * and 3D GPS route beacons.
 */
export default function ThreeAmbulanceTracker({ isDispatched = true, etaSeconds = 342 }) {
  const mountRef = useRef(null);
  const [cameraView, setCameraView] = useState('chase'); // 'chase', 'top', 'front'
  const cameraViewRef = useRef('chase');

  useEffect(() => {
    cameraViewRef.current = cameraView;
  }, [cameraView]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let width = currentMount.clientWidth || 580;
    let height = currentMount.clientHeight || 280;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 3.5, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // ==========================================
    // 1. HIGH SPEED ROAD & MOVING GRID
    // ==========================================
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    // Asphalt Plane
    const roadGeo = new THREE.PlaneGeometry(14, 80);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.2
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.05;
    roadGroup.add(road);

    // Dashed center road lines
    const stripeCount = 20;
    const stripes = [];
    const stripeGeo = new THREE.PlaneGeometry(0.3, 2.2);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    for (let i = 0; i < stripeCount; i++) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0, (i - 10) * 4);
      roadGroup.add(stripe);
      stripes.push(stripe);
    }

    // Side guard rails (neon green corridor)
    const railMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.65 });
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 80), railMat);
    leftRail.position.set(-6.5, 0.1, 0);
    roadGroup.add(leftRail);

    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 80), railMat);
    rightRail.position.set(6.5, 0.1, 0);
    roadGroup.add(rightRail);

    // Distant futuristic city silhouettes
    const buildingsGroup = new THREE.Group();
    for (let i = -15; i <= 15; i += 3) {
      const bHeight = 3 + Math.random() * 8;
      const bGeo = new THREE.BoxGeometry(2 + Math.random() * 2, bHeight, 2.5);
      const bMat = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });

      const bLeft = new THREE.Mesh(bGeo, bMat);
      bLeft.position.set(-11 - Math.random() * 3, bHeight / 2, i * 2.5);
      buildingsGroup.add(bLeft);

      const bRight = new THREE.Mesh(bGeo, bMat);
      bRight.position.set(11 + Math.random() * 3, bHeight / 2, i * 2.5);
      buildingsGroup.add(bRight);
    }
    scene.add(buildingsGroup);

    // ==========================================
    // 2. 3D AMBULANCE MODEL
    // ==========================================
    const ambulanceGroup = new THREE.Group();
    scene.add(ambulanceGroup);
    ambulanceGroup.position.set(0, 0.45, 0);

    // Main Body Chassis
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.5
    });
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 3.4), bodyMat);
    mainBody.position.y = 0.5;
    ambulanceGroup.add(mainBody);

    // Front Cabin Cab
    const cabGeo = new THREE.BoxGeometry(1.58, 0.95, 1.3);
    const cab = new THREE.Mesh(cabGeo, bodyMat);
    cab.position.set(0, 0.35, -1.8);
    ambulanceGroup.add(cab);

    // Windshield Glass (dark cyan tinted)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8
    });
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.1), glassMat);
    windshield.position.set(0, 0.55, -2.46);
    windshield.rotation.x = 0.15;
    ambulanceGroup.add(windshield);

    // Red Emergency Medical Cross on side
    const crossRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const crossV1 = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.7), crossRedMat);
    crossV1.position.set(0.81, 0.6, 0);
    crossV1.rotation.y = Math.PI / 2;
    ambulanceGroup.add(crossV1);

    const crossH1 = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.25), crossRedMat);
    crossH1.position.set(0.81, 0.6, 0);
    crossH1.rotation.y = Math.PI / 2;
    ambulanceGroup.add(crossH1);

    const crossV2 = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.7), crossRedMat);
    crossV2.position.set(-0.81, 0.6, 0);
    crossV2.rotation.y = -Math.PI / 2;
    ambulanceGroup.add(crossV2);

    const crossH2 = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.25), crossRedMat);
    crossH2.position.set(-0.81, 0.6, 0);
    crossH2.rotation.y = -Math.PI / 2;
    ambulanceGroup.add(crossH2);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelFL = new THREE.Mesh(wheelGeo, wheelMat);
    wheelFL.position.set(-0.85, 0, -1.5);
    ambulanceGroup.add(wheelFL);

    const wheelFR = new THREE.Mesh(wheelGeo, wheelMat);
    wheelFR.position.set(0.85, 0, -1.5);
    ambulanceGroup.add(wheelFR);

    const wheelRL = new THREE.Mesh(wheelGeo, wheelMat);
    wheelRL.position.set(-0.85, 0, 1.0);
    ambulanceGroup.add(wheelRL);

    const wheelRR = new THREE.Mesh(wheelGeo, wheelMat);
    wheelRR.position.set(0.85, 0, 1.0);
    ambulanceGroup.add(wheelRR);

    // Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const headlightL = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), headlightMat);
    headlightL.position.set(-0.55, 0.2, -2.46);
    headlightL.rotation.y = Math.PI;
    ambulanceGroup.add(headlightL);

    const headlightR = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), headlightMat);
    headlightR.position.set(0.55, 0.2, -2.46);
    headlightR.rotation.y = Math.PI;
    ambulanceGroup.add(headlightR);

    // Headlight Spotlights
    const spotL = new THREE.SpotLight(0xfef08a, 4, 18, Math.PI / 6, 0.4);
    spotL.position.set(-0.55, 0.2, -2.5);
    spotL.target.position.set(-0.55, -0.5, -12);
    scene.add(spotL);
    scene.add(spotL.target);

    // ==========================================
    // 3. EMERGENCY ROOF SIREN & FLASHING LIGHTS
    // ==========================================
    const sirenBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.15, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    sirenBar.position.set(0, 1.18, -1.4);
    ambulanceGroup.add(sirenBar);

    // Red Siren Light
    const sirenRed = new THREE.PointLight(0xef4444, 5, 12);
    sirenRed.position.set(-0.35, 1.35, -1.4);
    ambulanceGroup.add(sirenRed);

    // Blue Siren Light
    const sirenBlue = new THREE.PointLight(0x3b82f6, 5, 12);
    sirenBlue.position.set(0.35, 1.35, -1.4);
    ambulanceGroup.add(sirenBlue);

    // ==========================================
    // 4. DESTINATION RADAR PULSE (FRONT TARGET)
    // ==========================================
    const radarRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const radarRing1 = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.9, 32), radarRingMat);
    radarRing1.rotation.x = -Math.PI / 2;
    radarRing1.position.set(0, 0.05, -18);
    scene.add(radarRing1);

    const radarRing2 = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.7, 32), radarRingMat);
    radarRing2.rotation.x = -Math.PI / 2;
    radarRing2.position.set(0, 0.05, -18);
    scene.add(radarRing2);

    // Destination Marker Post
    const beaconPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3, 12),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    beaconPost.position.set(0, 1.5, -18);
    scene.add(beaconPost);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      width = currentMount.clientWidth;
      height = currentMount.clientHeight || 280;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 5. ANIMATION LOOP
    // ==========================================
    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Flashing Alternating Sirens (Strobe effect)
      const flash = Math.sin(elapsed * 18);
      sirenRed.intensity = flash > 0 ? 8 : 0.2;
      sirenBlue.intensity = flash <= 0 ? 8 : 0.2;

      // Road Stripes High-Speed Scroll
      stripes.forEach((stripe) => {
        stripe.position.z += 0.8;
        if (stripe.position.z > 30) {
          stripe.position.z = -50;
        }
      });

      // City buildings subtle drift
      buildingsGroup.position.z += 0.4;
      if (buildingsGroup.position.z > 25) {
        buildingsGroup.position.z = -25;
      }

      // Ambulance physical sway / vibration
      ambulanceGroup.position.y = 0.45 + Math.sin(elapsed * 24) * 0.02;
      ambulanceGroup.rotation.z = Math.sin(elapsed * 4) * 0.015;
      ambulanceGroup.rotation.y = Math.sin(elapsed * 2) * 0.01;

      // Wheels rotation
      wheelFL.rotation.x += 0.35;
      wheelFR.rotation.x += 0.35;
      wheelRL.rotation.x += 0.35;
      wheelRR.rotation.x += 0.35;

      // Radar pulse expansion
      const rScale1 = 1.0 + (elapsed * 2) % 3;
      radarRing1.scale.set(rScale1, rScale1, 1);
      radarRing1.material.opacity = Math.max(0, 1.0 - (rScale1 - 1.0) / 3);

      const rScale2 = 1.0 + ((elapsed * 2) + 1.5) % 3;
      radarRing2.scale.set(rScale2, rScale2, 1);
      radarRing2.material.opacity = Math.max(0, 1.0 - (rScale2 - 1.0) / 3);

      // Camera view positioning
      const view = cameraViewRef.current;
      if (view === 'chase') {
        camera.position.set(0, 2.8, 6.5);
        camera.lookAt(0, 1.0, -4);
      } else if (view === 'top') {
        camera.position.set(0, 14, 0.5);
        camera.lookAt(0, 0, -5);
      } else if (view === 'front') {
        camera.position.set(0, 1.8, -7);
        camera.lookAt(0, 1.2, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="three-ambulance-container">
      <div className="three-ambulance-canvas" ref={mountRef}></div>

      {/* Floating 3D Telemetry Overlay */}
      <div className="ambulance-telemetry-hud">
        <div className="telemetry-chip siren-active">
          <span className="flashing-siren-dot"></span>
          <span>ALS Unit #04 • Priority 1 Transit</span>
        </div>

        <div className="telemetry-controls">
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'chase' ? 'active' : ''}`}
            onClick={() => setCameraView('chase')}
          >
            Chase View
          </button>
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'top' ? 'active' : ''}`}
            onClick={() => setCameraView('top')}
          >
            Drone View
          </button>
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'front' ? 'active' : ''}`}
            onClick={() => setCameraView('front')}
          >
            Front View
          </button>
        </div>
      </div>
    </div>
  );
}

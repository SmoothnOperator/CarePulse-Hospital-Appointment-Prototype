import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ThreeAmbulanceTracker
 * Highly-animated 3D WebGL Ambulance Rush Simulation:
 * 1. Dynamic Lane Overtaking & Slalom Physics (chassis roll, wheel steering)
 * 2. Civilian Traffic Cars pulling over to the shoulder
 * 3. 360-degree Sweeping Volumetric Siren Light Beams (Red & Blue)
 * 4. Dual Exhaust Nitro Smoke Particles
 * 5. High-Velocity Warp Speed Streaks
 * 6. Interactive Turbo Boost & Action Camera Modes with Live Speedometer
 */
export default function ThreeAmbulanceTracker({ isDispatched = true, etaSeconds = 342 }) {
  const mountRef = useRef(null);
  const [cameraView, setCameraView] = useState('chase'); // 'chase', 'cockpit', 'drone', 'front', 'action'
  const [isTurbo, setIsTurbo] = useState(false);
  const [speedKmh, setSpeedKmh] = useState(78);

  const cameraViewRef = useRef('chase');
  const isTurboRef = useRef(false);

  useEffect(() => {
    cameraViewRef.current = cameraView;
  }, [cameraView]);

  useEffect(() => {
    isTurboRef.current = isTurbo;
  }, [isTurbo]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let width = currentMount.clientWidth || 580;
    let height = currentMount.clientHeight || 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.028);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 250);
    camera.position.set(0, 3.2, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Ambient & Moon Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const moonLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    moonLight.position.set(10, 20, 10);
    scene.add(moonLight);

    // ==========================================
    // 1. HIGH SPEED ROAD & MULTI-LANE HIGHWAY
    // ==========================================
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    // 4-Lane Asphalt Road Plane
    const roadGeo = new THREE.PlaneGeometry(16, 120);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.75,
      metalness: 0.3
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.05;
    roadGroup.add(road);

    // Dashed center road stripes (3 dividers for 4 lanes)
    const stripeCount = 28;
    const stripesL = [];
    const stripesC = [];
    const stripesR = [];
    const stripeGeo = new THREE.PlaneGeometry(0.24, 2.5);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    for (let i = 0; i < stripeCount; i++) {
      const zPos = (i - 14) * 4.2;

      const sL = new THREE.Mesh(stripeGeo, stripeMat);
      sL.rotation.x = -Math.PI / 2;
      sL.position.set(-3.5, 0, zPos);
      roadGroup.add(sL);
      stripesL.push(sL);

      const sC = new THREE.Mesh(stripeGeo, stripeMat);
      sC.rotation.x = -Math.PI / 2;
      sC.position.set(0, 0, zPos);
      roadGroup.add(sC);
      stripesC.push(sC);

      const sR = new THREE.Mesh(stripeGeo, stripeMat);
      sR.rotation.x = -Math.PI / 2;
      sR.position.set(3.5, 0, zPos);
      roadGroup.add(sR);
      stripesR.push(sR);
    }

    // Glowing Green Highway Emergency Corridor Barriers
    const barrierMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.75 });
    const leftBarrier = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 120), barrierMat);
    leftBarrier.position.set(-7.9, 0.2, 0);
    roadGroup.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 120), barrierMat);
    rightBarrier.position.set(7.9, 0.2, 0);
    roadGroup.add(rightBarrier);

    // City Neon Skyscrapers Silhouettes
    const cityGroup = new THREE.Group();
    for (let i = -20; i <= 20; i += 3) {
      const bHeight = 4 + Math.random() * 10;
      const bGeo = new THREE.BoxGeometry(2.5 + Math.random() * 2, bHeight, 3.2);
      const bColor = i % 2 === 0 ? 0x1e293b : 0x0f172a;
      const bMat = new THREE.MeshStandardMaterial({
        color: bColor,
        roughness: 0.9,
        wireframe: Math.random() > 0.6
      });

      const bL = new THREE.Mesh(bGeo, bMat);
      bL.position.set(-13 - Math.random() * 3, bHeight / 2, i * 2.8);
      cityGroup.add(bL);

      const bR = new THREE.Mesh(bGeo, bMat);
      bR.position.set(13 + Math.random() * 3, bHeight / 2, i * 2.8);
      cityGroup.add(bR);
    }
    scene.add(cityGroup);

    // ==========================================
    // 2. 3D AMBULANCE MODEL WITH STEERING & BODY ROLL
    // ==========================================
    const ambulanceRoot = new THREE.Group();
    scene.add(ambulanceRoot);
    ambulanceRoot.position.set(0, 0.45, 0);

    // Main Chassis
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.4
    });
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.68, 1.25, 3.6), bodyMat);
    mainBody.position.y = 0.55;
    ambulanceRoot.add(mainBody);

    // Front Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.66, 1.0, 1.4), bodyMat);
    cab.position.set(0, 0.4, -1.9);
    ambulanceRoot.add(cab);

    // Windshield
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.1), glassMat);
    windshield.position.set(0, 0.62, -2.62);
    windshield.rotation.x = 0.18;
    ambulanceRoot.add(windshield);

    // Red Emergency Medical Cross on sides
    const crossRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const addSideCross = (xPos, rotY) => {
      const v = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.75), crossRedMat);
      v.position.set(xPos, 0.65, 0.1);
      v.rotation.y = rotY;
      ambulanceRoot.add(v);

      const h = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.26), crossRedMat);
      h.position.set(xPos, 0.65, 0.1);
      h.rotation.y = rotY;
      ambulanceRoot.add(h);
    };
    addSideCross(0.85, Math.PI / 2);
    addSideCross(-0.85, -Math.PI / 2);

    // Front Steerable Wheels (with independent turning pivots)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.95 });
    const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const steerPivotFL = new THREE.Group();
    steerPivotFL.position.set(-0.9, 0, -1.6);
    ambulanceRoot.add(steerPivotFL);
    const wheelFL = new THREE.Mesh(wheelGeo, wheelMat);
    steerPivotFL.add(wheelFL);

    const steerPivotFR = new THREE.Group();
    steerPivotFR.position.set(0.9, 0, -1.6);
    ambulanceRoot.add(steerPivotFR);
    const wheelFR = new THREE.Mesh(wheelGeo, wheelMat);
    steerPivotFR.add(wheelFR);

    // Rear Fixed Wheels
    const wheelRL = new THREE.Mesh(wheelGeo, wheelMat);
    wheelRL.position.set(-0.9, 0, 1.1);
    ambulanceRoot.add(wheelRL);

    const wheelRR = new THREE.Mesh(wheelGeo, wheelMat);
    wheelRR.position.set(0.9, 0, 1.1);
    ambulanceRoot.add(wheelRR);

    // Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const hL = new THREE.Mesh(new THREE.CircleGeometry(0.14, 12), headlightMat);
    hL.position.set(-0.58, 0.25, -2.62);
    hL.rotation.y = Math.PI;
    ambulanceRoot.add(hL);

    const hR = new THREE.Mesh(new THREE.CircleGeometry(0.14, 12), headlightMat);
    hR.position.set(0.58, 0.25, -2.62);
    hR.rotation.y = Math.PI;
    ambulanceRoot.add(hR);

    // Headlight Long Spotlights
    const spotL = new THREE.SpotLight(0xfef08a, 4.5, 26, Math.PI / 5, 0.35);
    spotL.position.set(-0.58, 0.25, -2.7);
    spotL.target.position.set(-0.58, -0.5, -16);
    scene.add(spotL);
    scene.add(spotL.target);

    const spotR = new THREE.SpotLight(0xfef08a, 4.5, 26, Math.PI / 5, 0.35);
    spotR.position.set(0.58, 0.25, -2.7);
    spotR.target.position.set(0.58, -0.5, -16);
    scene.add(spotR);
    scene.add(spotR.target);

    // ==========================================
    // 3. 360° ROTATING VOLUMETRIC ROOF SIREN BEAMS
    // ==========================================
    const sirenBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.16, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    sirenBar.position.set(0, 1.25, -1.4);
    ambulanceRoot.add(sirenBar);

    // Point lights
    const sirenRed = new THREE.PointLight(0xef4444, 6, 15);
    sirenRed.position.set(-0.36, 1.45, -1.4);
    ambulanceRoot.add(sirenRed);

    const sirenBlue = new THREE.PointLight(0x38bdf8, 6, 15);
    sirenBlue.position.set(0.36, 1.45, -1.4);
    ambulanceRoot.add(sirenBlue);

    // 3D Sweeping Searchlight Cones (Volumetric Beam Effect)
    const coneGeo = new THREE.ConeGeometry(1.6, 6.0, 16, 1, true);
    coneGeo.rotateX(Math.PI / 2);
    coneGeo.translate(0, 0, -3.0);

    const redBeamMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const blueBeamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const rotatingSirenGroupRed = new THREE.Group();
    rotatingSirenGroupRed.position.set(-0.36, 1.35, -1.4);
    const redBeam = new THREE.Mesh(coneGeo, redBeamMat);
    rotatingSirenGroupRed.add(redBeam);
    ambulanceRoot.add(rotatingSirenGroupRed);

    const rotatingSirenGroupBlue = new THREE.Group();
    rotatingSirenGroupBlue.position.set(0.36, 1.35, -1.4);
    const blueBeam = new THREE.Mesh(coneGeo, blueBeamMat);
    rotatingSirenGroupBlue.add(blueBeam);
    ambulanceRoot.add(rotatingSirenGroupBlue);

    // ==========================================
    // 4. CIVILIAN TRAFFIC CARS BEING OVERTAKEN
    // ==========================================
    const trafficCars = [];
    const trafficColors = [0x3b82f6, 0xf59e0b, 0x10b981];

    for (let c = 0; c < 3; c++) {
      const tGroup = new THREE.Group();

      const tBodyMat = new THREE.MeshStandardMaterial({
        color: trafficColors[c],
        roughness: 0.4
      });
      const tBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 2.8), tBodyMat);
      tBody.position.y = 0.4;
      tGroup.add(tBody);

      // Red taillights
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const tTailL = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), tailMat);
      tTailL.position.set(-0.55, 0.4, 1.41);
      tGroup.add(tTailL);
      const tTailR = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), tailMat);
      tTailR.position.set(0.55, 0.4, 1.41);
      tGroup.add(tTailR);

      // Blinker (yielding to ambulance)
      const blinkerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const blinker = new THREE.Mesh(new THREE.CircleGeometry(0.08, 10), blinkerMat);
      blinker.position.set(0.65, 0.4, 1.41);
      tGroup.add(blinker);

      // Position in lanes ahead
      const startLane = c === 0 ? -2.8 : c === 1 ? 2.8 : -1.8;
      const startZ = -18 - c * 24;
      tGroup.position.set(startLane, 0, startZ);

      tGroup.userData = {
        baseLaneX: startLane,
        pullOverTargetX: startLane < 0 ? -5.5 : 5.5, // Pull over to shoulder
        speedZ: 0.28,
        blinker: blinker
      };

      scene.add(tGroup);
      trafficCars.push(tGroup);
    }

    // ==========================================
    // 5. DUAL NITRO EXHAUST & SMOKE PARTICLES
    // ==========================================
    const exhaustCount = 80;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPositions = new Float32Array(exhaustCount * 3);
    const exhaustColors = new Float32Array(exhaustCount * 3);
    const exhaustLifespans = new Float32Array(exhaustCount);

    for (let i = 0; i < exhaustCount; i++) {
      exhaustPositions[i * 3] = (Math.random() > 0.5 ? 0.5 : -0.5);
      exhaustPositions[i * 3 + 1] = 0.15;
      exhaustPositions[i * 3 + 2] = 1.9 + Math.random() * 2;

      exhaustColors[i * 3] = 0.2;
      exhaustColors[i * 3 + 1] = 0.8;
      exhaustColors[i * 3 + 2] = 1.0;
      exhaustLifespans[i] = Math.random();
    }

    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
    exhaustGeo.setAttribute('color', new THREE.BufferAttribute(exhaustColors, 3));

    const exhaustMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const exhaustParticles = new THREE.Points(exhaustGeo, exhaustMat);
    scene.add(exhaustParticles);

    // ==========================================
    // 6. WARP SPEED LINES (HYPER VELOCITY EFFECT)
    // ==========================================
    const warpCount = 90;
    const warpGeo = new THREE.BufferGeometry();
    const warpPos = new Float32Array(warpCount * 6); // 2 vertices per streak

    for (let i = 0; i < warpCount; i++) {
      const wx = (Math.random() - 0.5) * 14;
      const wy = 0.2 + Math.random() * 5;
      const wz = -40 + Math.random() * 60;

      warpPos[i * 6] = wx;
      warpPos[i * 6 + 1] = wy;
      warpPos[i * 6 + 2] = wz;

      warpPos[i * 6 + 3] = wx;
      warpPos[i * 6 + 4] = wy;
      warpPos[i * 6 + 5] = wz + 3.5;
    }
    warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));
    const warpMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });
    const warpLines = new THREE.LineSegments(warpGeo, warpMat);
    scene.add(warpLines);

    // ==========================================
    // 7. DESTINATION RADAR BEACON
    // ==========================================
    const radarMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const radarRing = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.35, 32), radarMat);
    radarRing.rotation.x = -Math.PI / 2;
    radarRing.position.set(0, 0.05, -28);
    scene.add(radarRing);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      width = currentMount.clientWidth;
      height = currentMount.clientHeight || 300;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 8. REAL-TIME ANIMATION LOOP (PHYSICS & MOTION)
    // ==========================================
    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const turboMultiplier = isTurboRef.current ? 1.75 : 1.0;

      // Update speedometer state every 15 frames
      if (Math.floor(elapsed * 60) % 15 === 0) {
        const baseSpd = isTurboRef.current ? 128 : 78;
        const jitter = Math.floor(Math.sin(elapsed * 10) * 3);
        setSpeedKmh(baseSpd + jitter);
      }

      // ==========================================
      // A. DYNAMIC LANE SLALOM & CHASSIS BODY ROLL
      // ==========================================
      const slalomSpeed = elapsed * 1.6 * turboMultiplier;
      // Weaves between -2.2 (left lane) and +2.2 (right lane)
      const targetLaneX = Math.sin(slalomSpeed) * 2.2;
      const steeringRate = Math.cos(slalomSpeed) * 0.35; // velocity derivative

      ambulanceRoot.position.x += (targetLaneX - ambulanceRoot.position.x) * 0.08;
      // Body roll: tilts into the turn
      ambulanceRoot.rotation.z = -steeringRate * 0.65;
      // Wheel turning angle
      steerPivotFL.rotation.y = steeringRate * 1.1;
      steerPivotFR.rotation.y = steeringRate * 1.1;

      // Suspension bounce over pavement joints
      const suspensionBump = Math.sin(elapsed * 32 * turboMultiplier) * 0.025;
      ambulanceRoot.position.y = 0.45 + Math.abs(suspensionBump);
      ambulanceRoot.rotation.x = Math.sin(elapsed * 16) * 0.015;

      // Synchronize headlight spotlights
      spotL.position.x = ambulanceRoot.position.x - 0.58;
      spotL.target.position.x = ambulanceRoot.position.x - 0.58;
      spotR.position.x = ambulanceRoot.position.x + 0.58;
      spotR.target.position.x = ambulanceRoot.position.x + 0.58;

      // ==========================================
      // B. ROTATING VOLUMETRIC SIRENS & FLASHES
      // ==========================================
      const sirenRotSpeed = elapsed * 14;
      rotatingSirenGroupRed.rotation.y = sirenRotSpeed;
      rotatingSirenGroupBlue.rotation.y = -sirenRotSpeed;

      const flash = Math.sin(elapsed * 24);
      sirenRed.intensity = flash > 0 ? 10 : 0.8;
      sirenBlue.intensity = flash <= 0 ? 10 : 0.8;

      // ==========================================
      // C. HIGH-SPEED ROAD STRIPES SCROLL
      // ==========================================
      const stripeSpeed = 0.9 * turboMultiplier;
      const updateStripes = (arr) => {
        arr.forEach((s) => {
          s.position.z += stripeSpeed;
          if (s.position.z > 35) s.position.z = -55;
        });
      };
      updateStripes(stripesL);
      updateStripes(stripesC);
      updateStripes(stripesR);

      cityGroup.position.z += 0.35 * turboMultiplier;
      if (cityGroup.position.z > 25) cityGroup.position.z = -25;

      // ==========================================
      // D. CIVILIAN TRAFFIC OVERTAKING & YIELDING
      // ==========================================
      trafficCars.forEach((car) => {
        // Move car backwards relative to ambulance
        car.position.z += 0.55 * turboMultiplier;

        // When ambulance is within 18 units behind, car pulls over to the shoulder!
        if (car.position.z > -16 && car.position.z < 10) {
          car.position.x += (car.userData.pullOverTargetX - car.position.x) * 0.05;
          // Blinker flash
          car.userData.blinker.material.color.setHex((Math.sin(elapsed * 16) > 0) ? 0xf59e0b : 0x334155);
        } else if (car.position.z > 25) {
          // Reset ahead
          car.position.z = -65 - Math.random() * 20;
          car.position.x = car.userData.baseLaneX;
        }
      });

      // ==========================================
      // E. EXHAUST PARTICLES EMISSION
      // ==========================================
      const posAttr = exhaustGeo.attributes.position;
      for (let i = 0; i < exhaustCount; i++) {
        let pz = posAttr.getZ(i);
        pz += (0.6 + Math.random() * 0.4) * turboMultiplier;
        if (pz > 12) {
          // Respawn at ambulance tailpipe
          const side = (i % 2 === 0 ? 0.55 : -0.55);
          posAttr.setXYZ(i, ambulanceRoot.position.x + side, 0.2 + Math.random() * 0.1, 1.8);
        } else {
          posAttr.setZ(i, pz);
          // Smoke expands as it trails away
          posAttr.setX(i, posAttr.getX(i) + (Math.random() - 0.5) * 0.04);
          posAttr.setY(i, posAttr.getY(i) + 0.015);
        }
      }
      posAttr.needsUpdate = true;

      // ==========================================
      // F. WARP SPEED LINES STREAKING
      // ==========================================
      const warpPosAttr = warpGeo.attributes.position;
      const warpVelocity = (isTurboRef.current ? 2.5 : 1.2);
      for (let i = 0; i < warpCount; i++) {
        let z1 = warpPosAttr.getZ(i * 2);
        let z2 = warpPosAttr.getZ(i * 2 + 1);

        z1 += warpVelocity;
        z2 += warpVelocity;

        if (z1 > 15) {
          const newZ = -45 - Math.random() * 20;
          warpPosAttr.setZ(i * 2, newZ);
          warpPosAttr.setZ(i * 2 + 1, newZ + (isTurboRef.current ? 6.5 : 3.5));
        } else {
          warpPosAttr.setZ(i * 2, z1);
          warpPosAttr.setZ(i * 2 + 1, z2);
        }
      }
      warpPosAttr.needsUpdate = true;

      // Radar pulse
      const rScale = 1.0 + (elapsed * 2.5) % 4;
      radarRing.scale.set(rScale, rScale, 1);
      radarRing.material.opacity = Math.max(0, 1.0 - (rScale - 1.0) / 4);

      // ==========================================
      // G. CAMERA WORK & DYNAMIC SHAKE
      // ==========================================
      const camRumble = (Math.sin(elapsed * 38) * 0.02) * (isTurboRef.current ? 2.2 : 1.0);
      const view = cameraViewRef.current;

      if (view === 'chase') {
        // Smoothly follows ambulance X position with slight lag
        const targetCamX = ambulanceRoot.position.x * 0.45;
        camera.position.x += (targetCamX - camera.position.x) * 0.08 + camRumble;
        camera.position.y = 2.7 + camRumble;
        camera.position.z = 6.4 + (isTurboRef.current ? 0.6 : 0);
        camera.lookAt(ambulanceRoot.position.x * 0.7, 1.1, -6);
      } else if (view === 'cockpit') {
        camera.position.set(ambulanceRoot.position.x, 1.2 + camRumble, -1.7);
        camera.lookAt(ambulanceRoot.position.x + steeringRate * 2, 0.8, -25);
      } else if (view === 'drone') {
        camera.position.set(0, 15, 2.0);
        camera.lookAt(ambulanceRoot.position.x, 0, -8);
      } else if (view === 'front') {
        camera.position.set(ambulanceRoot.position.x * 0.3, 1.6 + camRumble, -7.5);
        camera.lookAt(ambulanceRoot.position.x, 1.0, 0);
      } else if (view === 'action') {
        // Dramatic action cut angle cycling every 4 seconds
        const cut = Math.floor(elapsed / 4) % 3;
        if (cut === 0) {
          // Low wheel chase
          camera.position.set(ambulanceRoot.position.x + 2.5, 0.6, 2.5);
          camera.lookAt(ambulanceRoot.position.x, 0.8, -4);
        } else if (cut === 1) {
          // Front flyby
          camera.position.set(-3.5, 1.4, -4.5);
          camera.lookAt(ambulanceRoot.position.x, 1.0, 0);
        } else {
          // High chase
          camera.position.set(ambulanceRoot.position.x * 0.5, 4.8, 8.5);
          camera.lookAt(ambulanceRoot.position.x, 0.5, -5);
        }
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
        <div className="hud-badge-stack">
          <div className="telemetry-chip siren-active">
            <span className="flashing-siren-dot"></span>
            <span>ALS Unit #04 • Priority 1 Transit</span>
          </div>

          <div className="speedometer-pill">
            <span className="speed-label">SPEED:</span>
            <span className="speed-number">{speedKmh}</span>
            <span className="speed-unit">KM/H</span>
          </div>
        </div>

        <div className="telemetry-controls">
          {/* Turbo Nitro Boost Button */}
          <button
            type="button"
            className={`btn-turbo-boost ${isTurbo ? 'turbo-active' : ''}`}
            onClick={() => setIsTurbo(!isTurbo)}
            title="Engage High-Velocity Turbo Boost"
          >
            <span>{isTurbo ? '🔥 NITRO: 130 KM/H' : '⚡ BOOST'}</span>
          </button>

          {/* Camera View Toggles */}
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'chase' ? 'active' : ''}`}
            onClick={() => setCameraView('chase')}
          >
            Chase
          </button>
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'cockpit' ? 'active' : ''}`}
            onClick={() => setCameraView('cockpit')}
          >
            Cockpit
          </button>
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'front' ? 'active' : ''}`}
            onClick={() => setCameraView('front')}
          >
            Front
          </button>
          <button
            type="button"
            className={`btn-view-toggle ${cameraView === 'action' ? 'active' : ''}`}
            onClick={() => setCameraView('action')}
          >
            🎬 Action Cam
          </button>
        </div>
      </div>
    </div>
  );
}

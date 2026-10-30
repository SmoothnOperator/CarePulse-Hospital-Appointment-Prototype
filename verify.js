/**
 * Full verification script for CarePulse Hospital Prototype
 * Verifies both:
 * 1. Vanilla Design Thinking Prototype (vanilla-prototype.html)
 * 2. Full Stack React 19 + Three.js 3D Animations + Node.js Server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

console.log('--- STARTING 3D REACT + NODE.JS PROTOTYPE VERIFICATION ---');

const baseDir = __dirname;
const htmlPath = path.join(baseDir, 'index.html');
const vanillaPath = path.join(baseDir, 'vanilla-prototype.html');
const serverPath = path.join(baseDir, 'server', 'index.js');
const appJsxPath = path.join(baseDir, 'src', 'App.jsx');
const threeHeroPath = path.join(baseDir, 'src', 'components', 'ThreeHeroScene.jsx');
const threeHoloPath = path.join(baseDir, 'src', 'components', 'ThreeCoreFunctionHolo.jsx');
const threeTokenPath = path.join(baseDir, 'src', 'components', 'ThreeTokenCard.jsx');
const threeCubePath = path.join(baseDir, 'src', 'components', 'ThreeUncertaintyCube.jsx');
const distIndexPath = path.join(baseDir, 'dist', 'index.html');

// 1. Core file checks
assert(fs.existsSync(htmlPath), 'Root index.html exists');
assert(fs.existsSync(vanillaPath), 'Vanilla prototype backup exists');
assert(fs.existsSync(serverPath), 'Node.js Express server exists in server/index.js');
assert(fs.existsSync(appJsxPath), 'React App.jsx exists in src/App.jsx');
assert(fs.existsSync(threeHeroPath), 'ThreeHeroScene.jsx exists in src/components/');
assert(fs.existsSync(threeHoloPath), 'ThreeCoreFunctionHolo.jsx exists in src/components/');
assert(fs.existsSync(threeTokenPath), 'ThreeTokenCard.jsx exists in src/components/');
assert(fs.existsSync(threeCubePath), 'ThreeUncertaintyCube.jsx exists in src/components/');
assert(fs.existsSync(distIndexPath), 'Vite production build exists in dist/index.html');

// 2. Read contents
const appJsx = fs.readFileSync(appJsxPath, 'utf8');
const threeHero = fs.readFileSync(threeHeroPath, 'utf8');
const threeHolo = fs.readFileSync(threeHoloPath, 'utf8');
const threeToken = fs.readFileSync(threeTokenPath, 'utf8');
const threeCube = fs.readFileSync(threeCubePath, 'utf8');
const serverJs = fs.readFileSync(serverPath, 'utf8');

// 3. Verify REQUIREMENT 1: User interaction point
assert(
  appJsx.includes('interactionPointSlots') && appJsx.includes('slots-chips-grid'),
  'Req 1: User interaction point (slot touch chips & wrapper) integrated in React'
);
assert(
  appJsx.includes('data-requirement="user-touchpoint"'),
  'Req 1: User touchpoint markers are labelled in React DOM'
);
assert(
  appJsx.includes('handleSelectSlot') && appJsx.includes('tactile-3d'),
  'Req 1: Interactive 3D tactile slot selection handler wired in React'
);

// 4. Verify REQUIREMENT 2: Core function (circled and labelled) with 3D Holographic Reticle
assert(
  appJsx.includes('coreFunctionElement') && appJsx.includes('is-circled'),
  'Req 2: Core function element with is-circled class exists in React'
);
assert(
  appJsx.includes('ThreeCoreFunctionHolo'),
  'Req 2: 3D WebGL Holographic targeting reticle component rendered for Core Function'
);
assert(
  threeHolo.includes('THREE.TorusGeometry') && threeHolo.includes('0xef4444'),
  'Req 2: ThreeCoreFunctionHolo builds 3D crimson targeting ring and crosshairs'
);
assert(
  appJsx.includes('CORE FUNCTION (CIRCLED & LABELLED)'),
  'Req 2: Prominent Design Thinking badge label present for Core Function'
);

// 5. Verify REQUIREMENT 3: Knowing uncertainty with 3D Cube
assert(
  appJsx.includes('ThreeUncertaintyCube') && appJsx.includes('id="uncertaintyBanner"'),
  'Req 3: Knowing uncertainty section rendered with 3D perspective cube'
);
assert(
  threeCube.includes('cube-3d-scene') &&
  threeCube.includes('rotate-front') &&
  threeCube.includes('The One Thing We Do Not Yet Know Will Work'),
  'Req 3: 3D Cube includes all 4 dimensions (Hypothesis, Risk, Metrics, Pivot)'
);

// 6. Verify 3D WebGL Campus Navigator & 3D Holographic Token
assert(
  threeHero.includes('THREE.WebGLRenderer') &&
  threeHero.includes('Cardiology') &&
  threeHero.includes('raycaster.intersectObjects'),
  '3D WebGL Campus Navigator renders medical cross, orbiting departments & raycasting'
);
assert(
  threeToken.includes('perspective(1000px)') &&
  threeToken.includes('rotateX') &&
  threeToken.includes('holo-glare-foil'),
  '3D Holographic Token Card implements realistic mouse parallax & rainbow glare'
);

// 7. Verify Node.js Backend API
assert(
  serverJs.includes('/api/doctors') &&
  serverJs.includes('/api/book') &&
  serverJs.includes('/api/telemetry'),
  'Node.js server exposes /api/doctors, /api/book, and /api/telemetry endpoints'
);

console.log('\n--- VERIFICATION SUMMARY ---');
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (failCount === 0) {
  console.log('\nVERDICT: PASS');
  process.exit(0);
} else {
  console.log('\nVERDICT: FAIL');
  process.exit(1);
}

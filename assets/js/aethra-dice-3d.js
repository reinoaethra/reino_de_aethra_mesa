import * as THREE from 'https://esm.sh/three@0.187.0';

let rapierPromise = null;
async function getRapier() {
  if (!rapierPromise) {
    rapierPromise = import('https://esm.sh/@dimforge/rapier3d-deterministic-compat@0.21.0?bundle')
      .then(async (module) => {
        const rapier = module.default || module;
        await rapier.init();
        return rapier;
      })
      .catch((error) => {
        console.warn('[Aethra Dice 3D] Physics engine unavailable; using the built-in 3D motion fallback.', error);
        return null;
      });
  }
  return rapierPromise;
}

const SIDE_GEOMETRIES = {
  4: () => new THREE.TetrahedronGeometry(1.08, 0),
  6: () => new THREE.BoxGeometry(1.72, 1.72, 1.72),
  8: () => new THREE.OctahedronGeometry(1.12, 0),
  12: () => new THREE.DodecahedronGeometry(1.12, 0),
  20: () => new THREE.IcosahedronGeometry(1.14, 0)
};

const GOLD = 0xd8b36e;
const UP = new THREE.Vector3(0, 1, 0);

function seededRandom(seed) {
  let value = (Number(seed) >>> 0) || 0xA37A42;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

function customD10Faces() {
  // Pentagonal trapezohedron: 12 vertices and 10 kite-shaped faces.
  const c0 = (Math.sqrt(5) - 1) / 4;
  const c1 = (Math.sqrt(5) + 1) / 4;
  const c2 = (Math.sqrt(5) + 3) / 4;
  const vertices = [
    [0,c0,c1],[0,c0,-c1],[0,-c0,c1],[0,-c0,-c1],
    [.5,.5,.5],[.5,.5,-.5],[-.5,-.5,.5],[-.5,-.5,-.5],
    [c2,-c1,0],[-c2,c1,0],[c0,c1,0],[-c0,-c1,0]
  ].map(v => new THREE.Vector3(v[0],v[1],v[2]));
  const faceIndices = [
    [8,2,6,11],[8,11,7,3],[8,3,1,5],[8,5,10,4],[8,4,0,2],
    [9,0,4,10],[9,10,5,1],[9,1,3,7],[9,7,11,6],[9,6,2,0]
  ];
  return faceIndices.map(indices => indices.map(index => vertices[index].clone()));
}

function vectorKey(vector, digits = 3) {
  return `${vector.x.toFixed(digits)},${vector.y.toFixed(digits)},${vector.z.toFixed(digits)}`;
}

function geometryToFaces(geometry) {
  const flat = geometry.toNonIndexed();
  const attr = flat.getAttribute('position');
  const groups = new Map();
  for (let i = 0; i < attr.count; i += 3) {
    const a = new THREE.Vector3().fromBufferAttribute(attr, i);
    let b = new THREE.Vector3().fromBufferAttribute(attr, i + 1);
    let c = new THREE.Vector3().fromBufferAttribute(attr, i + 2);
    const normal = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();
    const center = a.clone().add(b).add(c).multiplyScalar(1 / 3);
    if (normal.dot(center) < 0) {
      const temp = b; b = c; c = temp; normal.negate();
    }
    const plane = normal.dot(a);
    const key = `${vectorKey(normal, 3)}|${plane.toFixed(3)}`;
    if (!groups.has(key)) groups.set(key, { normal, points: new Map() });
    const group = groups.get(key);
    [a,b,c].forEach(point => group.points.set(vectorKey(point, 4), point));
  }
  flat.dispose();
  return [...groups.values()].map(group => {
    const points = [...group.points.values()];
    const center = points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / points.length);
    const normal = group.normal.clone();
    let reference = Math.abs(normal.y) > .92 ? new THREE.Vector3(1,0,0) : UP;
    const axisX = new THREE.Vector3().crossVectors(reference, normal).normalize();
    const axisY = new THREE.Vector3().crossVectors(normal, axisX).normalize();
    points.sort((p1,p2) => {
      const v1 = p1.clone().sub(center), v2 = p2.clone().sub(center);
      return Math.atan2(v1.dot(axisY),v1.dot(axisX)) - Math.atan2(v2.dot(axisY),v2.dot(axisX));
    });
    return { points, center, normal };
  });
}

function createFaces(sides) {
  if (sides === 10) return customD10Faces().map(points => {
    const normal = new THREE.Vector3().crossVectors(points[1].clone().sub(points[0]), points[2].clone().sub(points[0])).normalize();
    const center = points.reduce((sum,p)=>sum.add(p),new THREE.Vector3()).multiplyScalar(1/points.length);
    if (normal.dot(center) < 0) { points.reverse(); normal.negate(); }
    return { points, center, normal };
  });
  const factory = SIDE_GEOMETRIES[sides];
  if (!factory) throw new Error(`Unsupported die: D${sides}`);
  const geometry = factory();
  const faces = geometryToFaces(geometry);
  geometry.dispose();
  return faces;
}

function assignFaceValues(faces,sides){
  if([6,8,10,12,20].includes(sides)){
    const remaining=faces.slice();let low=1,high=sides;
    while(remaining.length>=2){
      const face=remaining.shift();let bestIndex=0,bestDot=Infinity;
      for(let i=0;i<remaining.length;i++){
        const dot=face.normal.dot(remaining[i].normal);
        if(dot<bestDot){bestDot=dot;bestIndex=i;}
      }
      const opposite=remaining.splice(bestIndex,1)[0];
      face.value=low++;opposite.value=high--;
    }
    if(remaining.length)remaining[0].value=low;
  }else faces.forEach((face,index)=>{face.value=index+1;});
  return faces;
}

function createLabelAtlas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const cols = 5, rows = 4, cellW = canvas.width / cols, cellH = canvas.height / rows;
  for (let value = 1; value <= 20; value++) {
    const col = (value - 1) % cols, row = Math.floor((value - 1) / cols);
    const x = col * cellW, y = row * cellH;
    const pad = 18;
    const bx = x + pad, by = y + pad, bw = cellW - pad * 2, bh = cellH - pad * 2;
    const radius = 25;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 7;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,radius);
    const fill = ctx.createLinearGradient(bx,by,bx+bw,by+bh);
    fill.addColorStop(0,'#51402a'); fill.addColorStop(.48,'#211b16'); fill.addColorStop(1,'#5a4528');
    ctx.fillStyle = fill; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 9; ctx.strokeStyle = '#d7b36b'; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,235,183,.75)';
    ctx.beginPath(); ctx.roundRect(bx+11,by+11,bw-22,bh-22,Math.max(8,radius-7)); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `900 ${value>=10?112:132}px Georgia, serif`;
    ctx.lineWidth = 8; ctx.strokeStyle = '#261a0d'; ctx.strokeText(String(value),x+cellW/2,y+cellH/2+3);
    ctx.fillStyle = '#f4dfaa'; ctx.fillText(String(value),x+cellW/2,y+cellH/2+3);
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  texture.needsUpdate = true;
  return texture;
}

let labelAtlas = null;
function buildDieMesh(sides, seed) {
  const random = seededRandom(seed);
  const faces = assignFaceValues(createFaces(sides),sides);
  // Cada face tem numeração fixa; faces opostas somam o valor clássico do dado quando aplicável.
  const positions = [], edgePositions = [], labelPositions = [], labelUvs = [], labelIndices = [];
  const uniqueVertices = new Map(), uniqueEdges = new Set();

  for (const face of faces) {
    const points = face.points;
    for (let i = 1; i < points.length - 1; i++) {
      const tri = [points[0], points[i], points[i+1]];
      const normal = new THREE.Vector3().crossVectors(tri[1].clone().sub(tri[0]),tri[2].clone().sub(tri[0])).normalize();
      if (normal.dot(face.normal) < 0) [tri[1],tri[2]] = [tri[2],tri[1]];
      tri.forEach(point => positions.push(point.x,point.y,point.z));
    }
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i+1)%points.length];
      const ka=vectorKey(a,4), kb=vectorKey(b,4);
      uniqueVertices.set(ka,a); uniqueVertices.set(kb,b);
      const edgeKey=[ka,kb].sort().join('|');
      if (!uniqueEdges.has(edgeKey)) { uniqueEdges.add(edgeKey); edgePositions.push(a.x,a.y,a.z,b.x,b.y,b.z); }
    }

    const center = face.center.clone();
    const normal = face.normal.clone().normalize();
    const ref = Math.abs(normal.y) > .92 ? new THREE.Vector3(1,0,0) : UP;
    const axisX = new THREE.Vector3().crossVectors(ref,normal).normalize();
    const axisY = new THREE.Vector3().crossVectors(normal,axisX).normalize();
    let inRadius = Infinity;
    for (let i=0;i<points.length;i++) {
      const a=points[i], b=points[(i+1)%points.length], edge=b.clone().sub(a);
      inRadius=Math.min(inRadius,new THREE.Vector3().crossVectors(edge,center.clone().sub(a)).length()/edge.length());
    }
    const w=Math.max(.16,inRadius*1.38), h=Math.max(.13,inRadius*.91), z=normal.clone().multiplyScalar(.018);
    const corners=[
      center.clone().addScaledVector(axisX,-w/2).addScaledVector(axisY,-h/2).add(z),
      center.clone().addScaledVector(axisX,w/2).addScaledVector(axisY,-h/2).add(z),
      center.clone().addScaledVector(axisX,w/2).addScaledVector(axisY,h/2).add(z),
      center.clone().addScaledVector(axisX,-w/2).addScaledVector(axisY,h/2).add(z)
    ];
    const value=face.value, col=(value-1)%5, row=Math.floor((value-1)/5), margin=.075;
    const u0=col/5+margin/5, u1=(col+1)/5-margin/5;
    const v1=1-row/4-margin/4, v0=1-(row+1)/4+margin/4;
    const base=labelPositions.length/3;
    corners.forEach(p=>labelPositions.push(p.x,p.y,p.z));
    labelUvs.push(u0,v0,u1,v0,u1,v1,u0,v1);
    labelIndices.push(base,base+1,base+2,base,base+2,base+3);
  }

  const dieGroup=new THREE.Group();
  const bodyGeometry=new THREE.BufferGeometry();
  bodyGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  bodyGeometry.computeVertexNormals();
  const bodyMaterial=new THREE.MeshPhysicalMaterial({color:0x4a3b2a,metalness:.54,roughness:.29,clearcoat:.84,clearcoatRoughness:.2,flatShading:true});
  const bodyMesh=new THREE.Mesh(bodyGeometry,bodyMaterial); bodyMesh.castShadow=true; bodyMesh.receiveShadow=true; dieGroup.add(bodyMesh);

  const edgesGeometry=new THREE.BufferGeometry();
  edgesGeometry.setAttribute('position',new THREE.Float32BufferAttribute(edgePositions,3));
  const edgeMesh=new THREE.LineSegments(edgesGeometry,new THREE.LineBasicMaterial({color:GOLD,transparent:true,opacity:.92}));
  edgeMesh.renderOrder=2; dieGroup.add(edgeMesh);

  if (!labelAtlas) labelAtlas=createLabelAtlas();
  const labelGeometry=new THREE.BufferGeometry();
  labelGeometry.setAttribute('position',new THREE.Float32BufferAttribute(labelPositions,3));
  labelGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(labelUvs,2));
  labelGeometry.setIndex(labelIndices); labelGeometry.computeVertexNormals();
  const labelMaterial=new THREE.MeshStandardMaterial({map:labelAtlas,metalness:.32,roughness:.38,transparent:true,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const labels=new THREE.Mesh(labelGeometry,labelMaterial); labels.renderOrder=3; dieGroup.add(labels);

  const startEuler=new THREE.Euler((random()-.5)*Math.PI*2,(random()-.5)*Math.PI*2,(random()-.5)*Math.PI*2,'XYZ');
  const startQuaternion=new THREE.Quaternion().setFromEuler(startEuler);
  const vertices=[...uniqueVertices.values()];
  return {group:dieGroup,faces,vertices,startQuaternion,dispose(){bodyGeometry.dispose();bodyMaterial.dispose();edgesGeometry.dispose();edgeMesh.material.dispose();labelGeometry.dispose();labelMaterial.dispose();}};
}

function createScene(renderer, width, height) {
  const scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0x070b12,14,31);
  const camera=new THREE.PerspectiveCamera(36,width/height,.1,60);
  camera.position.set(0,8.4,15.8); camera.lookAt(0,.45,0);
  scene.add(new THREE.HemisphereLight(0xc2d1e7,0x241a12,1.75));
  const key=new THREE.DirectionalLight(0xffe6b5,3.1); key.position.set(-5,10,7); scene.add(key);
  const rim=new THREE.DirectionalLight(0x8b9fc6,2.0); rim.position.set(6,5,-7); scene.add(rim);
  const goldLight=new THREE.PointLight(0xd7a653,38,18,2); goldLight.position.set(-1,4,2); scene.add(goldLight);
  const fill=new THREE.PointLight(0x7690b7,18,16,2); fill.position.set(4,2,7); scene.add(fill);

  const floor=new THREE.Mesh(new THREE.BoxGeometry(20,.3,12),new THREE.MeshStandardMaterial({color:0x101720,metalness:.58,roughness:.4}));
  floor.position.y=-.3; floor.receiveShadow=true; scene.add(floor);
  const floorEdges=new THREE.LineSegments(new THREE.EdgesGeometry(floor.geometry),new THREE.LineBasicMaterial({color:0x80623b,transparent:true,opacity:.48}));
  floorEdges.position.copy(floor.position); scene.add(floorEdges);
  const runeRing=new THREE.Mesh(new THREE.TorusGeometry(4.3,.012,5,100),new THREE.MeshBasicMaterial({color:0xb68b4c,transparent:true,opacity:.22}));
  runeRing.rotation.x=Math.PI/2; runeRing.position.y=-.13; scene.add(runeRing);

  renderer.setClearColor(0x05080d,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.22;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.35));
  renderer.setSize(width,height,false);
  return {scene,camera,floor,floorEdges,runeRing};
}

function createRapierWorld(RAPIER) {
  const world=new RAPIER.World({x:0,y:-9.81,z:0});
  world.timestep=1/60;
  const addFixed=(x,y,z,hx,hy,hz)=>{
    const body=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,y,z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx,hy,hz).setFriction(.86).setRestitution(.32),body);
  };
  addFixed(0,-.49,0,9.8,.16,5.8);
  addFixed(-9.8,1.4,0,.16,1.9,5.8);
  addFixed(9.8,1.4,0,.16,1.9,5.8);
  addFixed(0,1.4,-5.8,9.8,1.9,.16);
  addFixed(0,1.4,5.8,9.8,1.9,.16);
  return world;
}

function createPhysicsDice(RAPIER, world, die, index, count, random, layout={}) {
  const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(count)));
  const rows=Math.ceil(count/columns);
  const col=index%columns, row=Math.floor(index/columns);
  const gap=layout.gap||(columns>=5?2.85:3.15);
  let x=(col-(Math.min(count,columns)-1)/2)*gap;
  if (count===1) x=-5.8;
  const z=(row-(rows-1)/2)*(layout.rowGap||2.05);
  const y=3.5+random()*1.6;
  const q=die.startQuaternion;
  const bodyDesc=RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x,y,z)
    .setRotation({x:q.x,y:q.y,z:q.z,w:q.w})
    .setLinvel({x:count===1?7+random()*1.3:(-x*.28+(random()-.5)*3.4),y:-.2-random()*1.1,z:(random()-.5)*3.2})
    .setAngvel({x:(random()-.5)*18,y:(random()-.5)*20,z:(random()-.5)*18})
    .setLinearDamping(.22).setAngularDamping(.2).setCanSleep(true);
  const body=world.createRigidBody(bodyDesc);
  const raw=new Float32Array(die.vertices.flatMap(v=>[v.x,v.y,v.z]));
  let collider=RAPIER.ColliderDesc.convexHull(raw);
  if (!collider) collider=RAPIER.ColliderDesc.ball(.94);
  world.createCollider(collider.setDensity(1.15).setFriction(.72).setRestitution(.36),body);
  return {body,die,startX:x,startZ:z,index};
}

function alignQuaternion(face, random) {
  const normal=face.normal.clone().normalize();
  const align=new THREE.Quaternion().setFromUnitVectors(normal,UP);
  const yaw=new THREE.Quaternion().setFromAxisAngle(UP,random()*Math.PI*2);
  return yaw.multiply(align);
}

function runKinematicFallback(dice, options, scene) {
  const duration=options.duration||2500;
  const layout=options.layout||{columns:5,gap:2.9,rowGap:1.85,finalGap:2.55,finalRowGap:1.8};
  const random=seededRandom(options.seed);
  const starts=dice.map((entry,index)=>{
    const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(dice.length)));
    const rows=Math.ceil(dice.length/columns);
    const x=dice.length===1?-7:(index%columns-(columns-1)/2)*(layout.gap||2.9);
    const z=(Math.floor(index/columns)-(rows-1)/2)*(layout.rowGap||1.85);
    const group=entry.die.group;
    group.position.set(x,3.4+random()*1.2,z);
    group.quaternion.copy(entry.die.startQuaternion);
    const face=entry.die.faces.find(f=>f.value===entry.value)||entry.die.faces[0];
    return {entry,group,start:group.position.clone(),rotation:group.quaternion.clone(),target:alignQuaternion(face,random),face};
  });
  return new Promise(resolve=>{
    const start=performance.now();
    const frame=now=>{
      if(!options.overlay.isConnected){resolve();return;}
      const t=Math.min(1,(now-start)/duration);
      starts.forEach((item,index)=>{
        const move=Math.min(1,t/.78),ease=move*move*(3-2*move);
        const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(starts.length)));
        const x=(index%columns-(columns-1)/2)*(layout.finalGap||2.55);
        const z=(Math.floor(index/columns)-(Math.ceil(starts.length/columns)-1)/2)*(layout.finalRowGap||1.8);
        item.group.position.x=THREE.MathUtils.lerp(item.start.x,x,ease);
        item.group.position.z=THREE.MathUtils.lerp(item.start.z,z,ease);
        item.group.position.y=.9+Math.abs(Math.sin(t*Math.PI*5+index*.45))*1.15*Math.pow(1-t,1.25);
        if(t<.78){
          const spin=new THREE.Quaternion().setFromEuler(new THREE.Euler(t*12+index,t*15+index*.7,t*17+index*.4));
          item.group.quaternion.copy(item.rotation).multiply(spin);
        } else {
          const settle=(t-.78)/.22; item.group.quaternion.slerpQuaternions(item.rotation,item.target,settle*settle*(3-2*settle));
        }
      });
      options.render();
      if(t<1) requestAnimationFrame(frame); else resolve();
    };
    requestAnimationFrame(frame);
  });
}

async function runPhysicsRoll(RAPIER,dice,options,scene) {
  const world=createRapierWorld(RAPIER);
  const random=seededRandom(options.seed);
  const layout=options.layout||{columns:5,gap:2.85,rowGap:2.05};
  const actors=dice.map((entry,index)=>createPhysicsDice(RAPIER,world,entry.die,index,dice.length,random,layout));
  const randomYaw=seededRandom((Number(options.seed)||1)^0x51A7);
  const finalTargets=actors.map(actor=>{
    const face=actor.die.faces.find(f=>f.value===actor.die.value)||actor.die.faces[0];
    return alignQuaternion(face,randomYaw);
  });
  const fixedStep=1/60;
  const targetSteps=Math.max(1,Math.round((options.duration||2650)/1000*60));
  let last=performance.now(),accumulator=0,physicsSteps=0,finalizing=false,finalStart=0,finalStates=[];
  return new Promise(resolve=>{
    const frame=now=>{
      if(!options.overlay.isConnected){world.free();resolve();return;}
      const dt=Math.min(.25,Math.max(0,(now-last)/1000)); last=now; accumulator+=dt;
      if(!finalizing){
        let safety=0;
        while(accumulator>=fixedStep&&safety<16&&physicsSteps<targetSteps){world.step();accumulator-=fixedStep;safety++;physicsSteps++;}
        actors.forEach(actor=>{
          const p=actor.body.translation(),q=actor.body.rotation();
          actor.die.group.position.set(p.x,p.y,p.z);
          actor.die.group.quaternion.set(q.x,q.y,q.z,q.w);
        });
        if(physicsSteps>=targetSteps){
          finalizing=true;finalStart=now;
          const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(actors.length)));
          const rows=Math.ceil(actors.length/columns);
          finalStates=actors.map((actor,index)=>{
            const face=actor.die.faces.find(f=>f.value===actor.die.value)||actor.die.faces[0];
            const p=actor.die.group.position.clone(),q=actor.die.group.quaternion.clone();
            const x=(index%columns-(columns-1)/2)*(layout.finalGap||2.35);
            const z=(Math.floor(index/columns)-(rows-1)/2)*(layout.finalRowGap||1.7);
            return {group:actor.die.group,start:p,end:new THREE.Vector3(x,.9,z),rotation:q,target:finalTargets[index]};
          });
        }
      }else{
        const settleDuration=options.settleDuration||550;
        const t=Math.min(1,(now-finalStart)/settleDuration),ease=t*t*(3-2*t);
        finalStates.forEach(item=>{
          item.group.position.lerpVectors(item.start,item.end,ease);
          item.group.quaternion.slerpQuaternions(item.rotation,item.target,ease);
        });
        if(t>=1){
          world.free(); resolve();
        }
      }
      options.render();
      if(!finalizing||now-finalStart<(options.settleDuration||550)) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

export async function play(overlay, config) {
  if (!window.WebGLRenderingContext && !window.WebGL2RenderingContext) throw new Error('Este navegador não disponibiliza WebGL para os dados 3D.');
  const rapierLoading=getRapier();
  const diceInput=Array.isArray(config.dice)?config.dice:[];
  if(!diceInput.length) throw new Error('Nenhum dado foi informado para a animação.');
  overlay.innerHTML=`<div class="v426-dice-scene"><canvas class="v426-dice-canvas" aria-label="Dados tridimensionais rolando"></canvas><div class="v426-dice-hud"><div class="v426-dice-kicker">${config.kicker||'ROLAGEM DE DADOS'}</div><h2>${config.title||'Os dados estão rolando'}</h2><p class="v426-dice-status">Os dados foram lançados...</p><div class="v426-dice-final" hidden></div><button class="btn btn-secondary btn-small v426-dice-continue" type="button">Continuar</button></div></div>`;
  const canvas=overlay.querySelector('canvas');
  const status=overlay.querySelector('.v426-dice-status');
  const final=overlay.querySelector('.v426-dice-final');
  const button=overlay.querySelector('.v426-dice-continue');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:window.devicePixelRatio<2, powerPreference:'high-performance',depth:true,stencil:false});
  const size=()=>({width:Math.max(320,overlay.clientWidth||window.innerWidth),height:Math.max(240,overlay.clientHeight||window.innerHeight)});
  let dimensions=size();
  const {scene,camera}=createScene(renderer,dimensions.width,dimensions.height);
  const rendererResize=()=>{
    dimensions=size(); camera.aspect=dimensions.width/dimensions.height;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.35));renderer.setSize(dimensions.width,dimensions.height,false);
  };
  window.addEventListener('resize',rendererResize,{passive:true});
  const random=seededRandom(config.seed);
  const reducedMotion=!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const physicsDuration=reducedMotion?900:2650,settleDuration=reducedMotion?260:550;
  const mobile=dimensions.width<680;
  const layout={columns:mobile?3:5,gap:mobile?1.95:2.85,rowGap:mobile?1.75:2.05,finalGap:mobile?1.55:2.35,finalRowGap:mobile?1.45:1.7};
  const dice=diceInput.slice(0,20).map((entry,index)=>{
    const die=buildDieMesh(Number(entry.sides)||20,(Number(config.seed)||1)+index*991);
    die.value=Math.max(1,Math.min(die.faces.length,Math.floor(Number(entry.value)||1)));
    scene.add(die.group);
    return {die,value:die.value,sides:Number(entry.sides)||20};
  });
  const tray=document.createElement('div');tray.className='v426-dice-a11y';tray.textContent=`${dice.length} dado(s) tridimensionais`;overlay.append(tray);
  const render=()=>renderer.render(scene,camera);
  let disposed=false;
  const cleanup=()=>{
    if(disposed)return;disposed=true;
    window.removeEventListener('resize',rendererResize);
    dice.forEach(entry=>{scene.remove(entry.die.group);entry.die.dispose();});
    scene.traverse(object=>{if(object.geometry)object.geometry.dispose();if(object.material){const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(material=>material.dispose())}});
    renderer.dispose();
  };
  button.addEventListener('click',()=>{cleanup();overlay.remove();});
  render();
  try {
    const RAPIER=await rapierLoading;
    if(RAPIER) await runPhysicsRoll(RAPIER,dice,{seed:config.seed,overlay,render,layout,duration:physicsDuration,settleDuration},scene);
    else await runKinematicFallback(dice,{seed:config.seed,overlay,render,layout,duration:reducedMotion?650:2500},scene);
  } catch(error) {
    console.error('[Aethra Dice 3D] Rolling simulation failed; using 3D motion fallback.',error);
    await runKinematicFallback(dice,{seed:config.seed,overlay,render,layout,duration:reducedMotion?650:2500},scene);
  }
  if(!overlay.isConnected)return;
  status.textContent='A rolagem terminou.';
  final.hidden=false;
  final.innerHTML=config.resultHtml||'';
  button.focus({preventScroll:true});
  const autoClose=setTimeout(()=>{if(overlay.isConnected){cleanup();overlay.remove();}},12000);
  button.addEventListener('click',()=>clearTimeout(autoClose),{once:true});
  return {cleanup};
}

export const version='4.2.6';

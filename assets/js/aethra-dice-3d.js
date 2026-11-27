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
const TABLE_TOP = -0.15;
const TABLE_CLEARANCE = 0.055;

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
    face.labelAxisY = axisY.clone();
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

function configureTopDownCamera(camera,width,height) {
  const aspect=Math.max(.45,width/Math.max(1,height));
  const viewHeight=aspect<1.05?18.5:13.1;
  const viewWidth=viewHeight*aspect;
  camera.left=-viewWidth/2;camera.right=viewWidth/2;
  camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
  camera.near=.1;camera.far=55;
  camera.position.set(0,24,0);
  camera.up.set(0,0,-1);
  camera.lookAt(0,0,0);
  camera.updateProjectionMatrix();
}

function createScene(renderer, width, height) {
  const scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0x070b12,24,48);
  const camera=new THREE.OrthographicCamera(-10,10,6,-6,.1,55);
  configureTopDownCamera(camera,width,height);
  scene.add(new THREE.HemisphereLight(0xc2d1e7,0x241a12,1.85));
  const key=new THREE.DirectionalLight(0xffe6b5,3.25); key.position.set(-4,12,5); scene.add(key);
  const rim=new THREE.DirectionalLight(0x8b9fc6,1.9); rim.position.set(6,8,-7); scene.add(rim);
  const goldLight=new THREE.PointLight(0xd7a653,32,22,2); goldLight.position.set(-1,7,2); scene.add(goldLight);
  const fill=new THREE.PointLight(0x7690b7,14,20,2); fill.position.set(4,5,7); scene.add(fill);

  const floor=new THREE.Mesh(new THREE.BoxGeometry(20,.30,12),new THREE.MeshStandardMaterial({color:0x101720,metalness:.58,roughness:.4}));
  floor.position.y=-.30;floor.receiveShadow=true;scene.add(floor);
  const floorEdges=new THREE.LineSegments(new THREE.EdgesGeometry(floor.geometry),new THREE.LineBasicMaterial({color:0x80623b,transparent:true,opacity:.55}));
  floorEdges.position.copy(floor.position);scene.add(floorEdges);
  const runeRing=new THREE.Mesh(new THREE.TorusGeometry(4.3,.012,5,100),new THREE.MeshBasicMaterial({color:0xb68b4c,transparent:true,opacity:.20}));
  runeRing.rotation.x=Math.PI/2;runeRing.position.y=TABLE_TOP+.012;scene.add(runeRing);
  const marks=new THREE.Group();
  const markMaterial=new THREE.LineBasicMaterial({color:0x987343,transparent:true,opacity:.18});
  for(let x=-8;x<=8;x+=2){
    const geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,TABLE_TOP+.008,-5.4),new THREE.Vector3(x,TABLE_TOP+.008,5.4)]);
    marks.add(new THREE.Line(geometry,markMaterial));
  }
  for(let z=-4;z<=4;z+=2){
    const geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-9.4,TABLE_TOP+.009,z),new THREE.Vector3(9.4,TABLE_TOP+.009,z)]);
    marks.add(new THREE.Line(geometry,markMaterial));
  }
  scene.add(marks);
  renderer.setClearColor(0x05080d,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.22;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));
  renderer.setSize(width,height,false);
  return {scene,camera,floor,floorEdges,runeRing,marks};
}

function createRapierWorld(RAPIER) {
  const world=new RAPIER.World({x:0,y:-9.81,z:0});
  world.timestep=1/60;
  const addFixed=(x,y,z,hx,hy,hz)=>{
    const body=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,y,z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx,hy,hz).setFriction(.48).setRestitution(.38),body);
  };
  // Piso visual: centro -0,30 e espessura 0,30. O colisor termina no mesmo topo y=-0,15.
  addFixed(0,-.30,0,10,.15,6);
  // Paredes contínuas desde a superfície do tampo.
  addFixed(-9.84,1.45,0,.16,1.60,6);
  addFixed(9.84,1.45,0,.16,1.60,6);
  addFixed(0,1.45,-5.84,10,1.60,.16);
  addFixed(0,1.45,5.84,10,1.60,.16);
  return world;
}

function createPhysicsDice(RAPIER, world, die, index, count, random, layout={}) {
  const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(count)));
  const rows=Math.ceil(count/columns);
  const col=index%columns,row=Math.floor(index/columns);
  const gap=layout.gap||3.0,rowGap=layout.rowGap||2.35;
  const targetX=(col-(Math.min(count,columns)-1)/2)*gap;
  const targetZ=(row-(rows-1)/2)*rowGap;
  const x=targetX+(random()-.5)*1.15;
  const z=count===1?4.65:targetZ+(random()-.5)*1.25;
  const y=3.2+random()*1.25;
  const q=die.startQuaternion;
  const vx=count===1?6.5+random()*2.1:(-targetX*.12+(random()-.5)*4.8);
  const vz=count===1?-6.0-random()*1.5:(random()-.5)*5.2-(targetZ*.08);
  const bodyDesc=RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x,y,z)
    .setRotation({x:q.x,y:q.y,z:q.z,w:q.w})
    .setLinvel({x:vx,y:-.8-random()*1.3,z:vz})
    .setAngvel({x:(random()-.5)*17,y:(random()-.5)*19,z:(random()-.5)*17})
    .setLinearDamping(.12).setAngularDamping(.16).setCanSleep(true).setCcdEnabled(true);
  const body=world.createRigidBody(bodyDesc);
  const raw=new Float32Array(die.vertices.flatMap(v=>[v.x,v.y,v.z]));
  let collider=RAPIER.ColliderDesc.convexHull(raw);
  if (!collider) collider=RAPIER.ColliderDesc.ball(.94);
  world.createCollider(collider.setDensity(1.0).setFriction(.48).setRestitution(.40),body);
  return {body,die,startX:x,startZ:z,index,targetX,targetZ};
}

function alignQuaternion(face) {
  const normal=face.normal.clone().normalize();
  const align=new THREE.Quaternion().setFromUnitVectors(normal,UP);
  // Alinha o eixo vertical do algarismo à parte superior da tela na câmera superior.
  const faceUp=(face.labelAxisY||new THREE.Vector3(0,1,0)).clone().applyQuaternion(align).normalize();
  const screenUp=new THREE.Vector3(0,0,-1);
  const signedAngle=Math.atan2(UP.dot(new THREE.Vector3().crossVectors(faceUp,screenUp)),faceUp.dot(screenUp));
  const yaw=new THREE.Quaternion().setFromAxisAngle(UP,signedAngle);
  return yaw.multiply(align);
}

function supportHeightForRotation(die, quaternion, clearance=TABLE_CLEARANCE) {
  let lowest=Infinity;
  for (const vertex of die.vertices) {
    const rotatedY=vertex.clone().applyQuaternion(quaternion).y;
    if (rotatedY<lowest) lowest=rotatedY;
  }
  return TABLE_TOP-lowest+clearance;
}

function runKinematicFallback(dice, options, scene) {
  const duration=options.duration||3000;
  const layout=options.layout||{columns:5,gap:3,rowGap:2.35,finalGap:3,finalRowGap:2.45};
  const random=seededRandom(options.seed);
  const starts=dice.map((entry,index)=>{
    const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(dice.length)));
    const rows=Math.ceil(dice.length/columns),col=index%columns,row=Math.floor(index/columns);
    const x=dice.length===1?-6:(col-(columns-1)/2)*(layout.gap||3);
    const z=dice.length===1?4.7:(row-(rows-1)/2)*(layout.rowGap||2.35);
    const group=entry.die.group;
    group.position.set(x+(random()-.5),3.5+random(),z+(random()-.5));
    group.quaternion.copy(entry.die.startQuaternion);
    const face=entry.die.faces.find(f=>f.value===entry.value)||entry.die.faces[0];
    const target=alignQuaternion(face),startQ=group.quaternion.clone();
    group.position.y=Math.max(group.position.y,supportHeightForRotation(entry.die,startQ)+1.3);
    return {entry,group,start:group.position.clone(),rotation:startQ,target,face};
  });
  return new Promise(resolve=>{
    const start=performance.now();
    const frame=now=>{
      if(!options.overlay.isConnected){resolve();return;}
      const t=Math.min(1,(now-start)/duration);
      starts.forEach((item,index)=>{
        const roll=Math.min(1,t/.80),ease=roll*roll*(3-2*roll);
        const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(starts.length)));
        const rows=Math.ceil(starts.length/columns),col=index%columns,row=Math.floor(index/columns);
        const x=(col-(columns-1)/2)*(layout.finalGap||3),z=(row-(rows-1)/2)*(layout.finalRowGap||2.45);
        item.group.position.x=THREE.MathUtils.lerp(item.start.x,x,ease);
        item.group.position.z=THREE.MathUtils.lerp(item.start.z,z,ease);
        if(t<.80){
          const spin=new THREE.Quaternion().setFromEuler(new THREE.Euler(t*15+index*.7,t*18+index*.4,t*19+index*.6));
          item.group.quaternion.copy(item.rotation).multiply(spin);
          item.group.position.y=supportHeightForRotation(item.entry.die,item.group.quaternion)+Math.abs(Math.sin(t*Math.PI*6+index*.45))*1.15*Math.pow(1-t,1.2);
        }else{
          const settle=(t-.80)/.20,e=settle*settle*(3-2*settle);
          item.group.quaternion.slerpQuaternions(item.rotation,item.target,e);
          const support=supportHeightForRotation(item.entry.die,item.group.quaternion);
          item.group.position.y=Math.max(support,THREE.MathUtils.lerp(item.group.position.y,support,.4+e*.6));
        }
      });
      options.render();
      if(t<1)requestAnimationFrame(frame);else resolve();
    };
    requestAnimationFrame(frame);
  });
}

async function runPhysicsRoll(RAPIER,dice,options,scene) {
  const world=createRapierWorld(RAPIER),random=seededRandom(options.seed);
  const layout=options.layout||{columns:5,gap:3,rowGap:2.35,finalGap:3,finalRowGap:2.45};
  const actors=dice.map((entry,index)=>createPhysicsDice(RAPIER,world,entry.die,index,dice.length,random,layout));
  const finalTargets=actors.map(actor=>alignQuaternion(actor.die.faces.find(f=>f.value===actor.die.value)||actor.die.faces[0]));
  const fixedStep=1/60,minSteps=Math.max(1,Math.round((options.duration||2900)/1000*60));
  const maxSteps=Math.max(minSteps+60,Math.round((options.maxDuration||4300)/1000*60));
  let last=performance.now(),accumulator=0,physicsSteps=0,quietSteps=0,finalizing=false,finalStart=0,finalStates=[];
  return new Promise(resolve=>{
    const frame=now=>{
      if(!options.overlay.isConnected){world.free();resolve();return;}
      const dt=Math.min(.20,Math.max(0,(now-last)/1000));last=now;accumulator+=dt;
      if(!finalizing){
        let safety=0;
        while(accumulator>=fixedStep&&safety<12&&physicsSteps<maxSteps){world.step();accumulator-=fixedStep;safety++;physicsSteps++;}
        actors.forEach(actor=>{const p=actor.body.translation(),q=actor.body.rotation();actor.die.group.position.set(p.x,p.y,p.z);actor.die.group.quaternion.set(q.x,q.y,q.z,q.w)});
        if(physicsSteps>=minSteps){
          const allCalm=actors.every(actor=>{const v=actor.body.linvel(),w=actor.body.angvel();return actor.body.isSleeping?.()===true||(Math.hypot(v.x,v.y,v.z)<.24&&Math.hypot(w.x,w.y,w.z)<1.45)});
          quietSteps=allCalm?quietSteps+1:0;
        }
        if((physicsSteps>=minSteps&&quietSteps>=14)||physicsSteps>=maxSteps){
          finalizing=true;finalStart=now;
          const columns=Math.min(layout.columns||5,Math.ceil(Math.sqrt(actors.length))),rows=Math.ceil(actors.length/columns);
          finalStates=actors.map((actor,index)=>{
            const p=actor.die.group.position.clone(),q=actor.die.group.quaternion.clone(),col=index%columns,row=Math.floor(index/columns);
            const endQ=finalTargets[index],x=(col-(columns-1)/2)*(layout.finalGap||3),z=(row-(rows-1)/2)*(layout.finalRowGap||2.45);
            return {actor,group:actor.die.group,start:new THREE.Vector3(p.x,Math.max(p.y,supportHeightForRotation(actor.die,q)),p.z),end:new THREE.Vector3(x,supportHeightForRotation(actor.die,endQ),z),rotation:q,target:endQ};
          });
        }
      }else{
        const settleDuration=options.settleDuration||700,t=Math.min(1,(now-finalStart)/settleDuration),ease=t*t*(3-2*t);
        finalStates.forEach(item=>{
          item.group.quaternion.slerpQuaternions(item.rotation,item.target,ease);
          const support=supportHeightForRotation(item.actor.die,item.group.quaternion);
          item.group.position.x=THREE.MathUtils.lerp(item.start.x,item.end.x,ease);
          item.group.position.z=THREE.MathUtils.lerp(item.start.z,item.end.z,ease);
          item.group.position.y=Math.max(support,THREE.MathUtils.lerp(item.start.y,item.end.y,ease));
        });
        if(t>=1){world.free();resolve();}
      }
      options.render();
      if(!finalizing||now-finalStart<(options.settleDuration||700))requestAnimationFrame(frame);
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
    dimensions=size();configureTopDownCamera(camera,dimensions.width,dimensions.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));renderer.setSize(dimensions.width,dimensions.height,false);
  };
  window.addEventListener('resize',rendererResize,{passive:true});
  const random=seededRandom(config.seed);
  const reducedMotion=!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const physicsDuration=reducedMotion?700:2900,settleDuration=reducedMotion?280:700;
  const portrait=dimensions.width/Math.max(1,dimensions.height)<1.05;
  const layout={columns:portrait?3:5,gap:3,rowGap:portrait?1.45:2.35,finalGap:3,finalRowGap:portrait?1.45:2.45};
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
    if(RAPIER) await runPhysicsRoll(RAPIER,dice,{seed:config.seed,overlay,render,layout,duration:physicsDuration,maxDuration:reducedMotion?1.6:4.3,settleDuration},scene);
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

export const version='4.2.8';

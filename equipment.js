import * as THREE from 'three';
import {OrbitControls} from './OrbitControls.js';
import {RoomEnvironment} from './RoomEnvironment.js';
import {RoundedBoxGeometry} from './RoundedBoxGeometry.js';

const host=document.querySelector('#model-view'),loading=document.querySelector('#model-loading');
try {
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(37,1,.1,80);
const initialCamera=new THREE.Vector3(6.6,5.3,8.2),initialTarget=new THREE.Vector3(0,1.25,0);
camera.position.copy(initialCamera);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0,0);
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
host.appendChild(renderer.domElement);
const generator=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=generator.fromScene(room,.07);
scene.environment=env.texture;room.dispose();generator.dispose();
scene.add(new THREE.HemisphereLight(0xf0f4df,0x233b27,2.1));
const key=new THREE.DirectionalLight(0xfff5dc,3.1);key.position.set(-4,7,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-5});key.shadow.normalBias=.035;key.shadow.bias=-.0003;scene.add(key);
const rim=new THREE.DirectionalLight(0xe1ecff,2.6);rim.position.set(3,5,-4);scene.add(rim);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.ShadowMaterial({opacity:.24}));floor.rotation.x=-Math.PI/2;floor.position.y=.025;floor.receiveShadow=true;scene.add(floor);
const grid=new THREE.GridHelper(12,24,0x769263,0x769263);grid.position.y=.012;grid.material.transparent=true;grid.material.opacity=.12;scene.add(grid);
const metal=new THREE.MeshStandardMaterial({color:0xb8c0bd,metalness:.9,roughness:.29});
const trim=new THREE.MeshStandardMaterial({color:0xd7dcd8,metalness:1,roughness:.18});
const dark=new THREE.MeshStandardMaterial({color:0x222d2b,metalness:.45,roughness:.5});
const cream=new THREE.MeshStandardMaterial({color:0xd2d2c2,metalness:.35,roughness:.55});
const rubber=new THREE.MeshStandardMaterial({color:0x121917,roughness:.86});
const blue=new THREE.MeshStandardMaterial({color:0x2368b5,roughness:.55,metalness:.1});
const red=new THREE.MeshStandardMaterial({color:0xa32c25,roughness:.4});
const green=new THREE.MeshStandardMaterial({color:0x4f9b59,roughness:.4});
const yellow=new THREE.MeshStandardMaterial({color:0xd3b052,roughness:.45});
const sharedTextures=[];
function box(parent,w,h,d,x,y,z,material=metal,r=.035){const geometry=r>0?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)):new THREE.BoxGeometry(w,h,d);const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cyl(parent,r,h,x,y,z,material=metal,axis='y',r2=r){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r2,h,48),material);if(axis==='z')mesh.rotation.x=Math.PI/2;if(axis==='x')mesh.rotation.z=Math.PI/2;mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;}
function ring(parent,r,t,x,y,z,material=trim,axis='z'){const m=new THREE.Mesh(new THREE.TorusGeometry(r,t,10,64),material);if(axis==='y')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.y=Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;}
function beam(parent,a,b,width=.06,material=metal){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const m=new THREE.Mesh(new THREE.CylinderGeometry(width,width,delta.length(),12),material);m.position.copy(start.clone().add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());m.castShadow=true;parent.add(m);return m;}
function wheel(parent,x,z){box(parent,.13,.23,.12,x,.36,z,trim,.01);cyl(parent,.13,.12,x,.18,z,rubber,'z');cyl(parent,.045,.13,x,.18,z,metal,'z');}
function panelTexture(kind){const c=document.createElement('canvas');c.width=1024;c.height=400;const x=c.getContext('2d');x.fillStyle='#172a36';x.fillRect(0,0,1024,400);x.strokeStyle='#6f8589';x.lineWidth=12;x.strokeRect(8,8,1008,384);x.fillStyle='#b3c2bb';x.font='27px Arial';x.textAlign='center';x.fillText(kind==='vacuum'?'CONTROL PANEL':'EQUIPMENT CONTROL',512,60);for(let i=0;i<3;i++){const p=180+i*230;x.fillStyle='#ddddc4';x.fillRect(p-55,110,110,155);x.fillStyle='#1b2825';x.fillRect(p-38,132,76,52);x.fillStyle='#d9e1ce';x.font='28px monospace';x.fillText('—',p,166);x.strokeStyle='#7c8675';x.lineWidth=5;x.beginPath();x.arc(p,222,26,0,Math.PI*2);x.stroke();}x.fillStyle='#b35a45';x.beginPath();x.arc(878,180,35,0,Math.PI*2);x.fill();x.fillStyle='#91a06e';x.beginPath();x.arc(878,280,18,0,Math.PI*2);x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;sharedTextures.push(t);return t;}
function panel(parent,x,y,z,w=2.5,h=.8){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:panelTexture('vacuum'),metalness:.3,roughness:.5}));mesh.position.set(x,y,z);parent.add(mesh);}
function vents(parent,x,y,z,count=6){for(let i=0;i<count;i++)box(parent,.018,.24,.013,x+i*.07,y,z,dark,0);}
function makeVacuum(){const group=new THREE.Group();
 box(group,4.5,1.55,2.05,0,1.25,0,metal,.07);box(group,4.68,.13,2.2,0,2.08,0,trim,.025);
 for(const x of [-1.93,1.93])for(const z of [-.78,.78])wheel(group,x,z);
 box(group,.035,1.18,.018,0,1.17,1.035,dark,0);panel(group,0,1.44,1.042,2.18,.61);
 cyl(group,.055,.025,-1.7,1.47,1.057,green,'z');cyl(group,.055,.025,-1.7,1.7,1.057,yellow,'z');
 vents(group,1.35,.77,1.04,6);
 const lids=[];
 for(const x of [-1.15,1.15]){
  box(group,2.02,.035,1.78,x,2.17,0,dark,.035);box(group,1.88,.04,1.65,x,2.19,0,metal,.025);
  for(const dx of [-.83,.83])box(group,.035,.04,1.5,x+dx,2.22,0,trim,.01);
  const pivot=new THREE.Group();pivot.position.set(x,2.27,-.91);group.add(pivot);
  box(pivot,2.06,.13,1.91,0,.05,.91,metal,.065);box(pivot,1.87,.025,1.7,0,-.03,.91,dark,.03);
  for(const side of [-.73,.73]){beam(pivot,[side,.12,1.5],[side,.37,1.5],.045,trim);}
  beam(pivot,[-.73,.37,1.5],[.73,.37,1.5],.055,trim);
  for(const dx of [-.72,.72])cyl(group,.1,.17,x+dx,2.3,-.92,trim,'x');
  lids.push(pivot);
 }
 return{group,animate:(active,t,dt)=>{lids.forEach((lid,i)=>{lid.rotation.x=THREE.MathUtils.damp(lid.rotation.x,active?(-.88-(i*.07)):0,4,dt);});},hotspots:[{name:'翻盖结构',text:'两组翻盖与金属把手，依据照片外形近似搭建。',pos:[-1.2,2.55,.7]},{name:'控制面板',text:'面板位置参考实拍。表盘与按钮仅作外观示意，未标定实际参数。',pos:[0,1.45,1.12]},{name:'底部脚轮',text:'机身下方的移动脚轮与支撑结构示意。',pos:[1.96,.26,.85]}]};}
function makeTumbler(){const group=new THREE.Group(),drums=[];
 for(const px of [-1.4,1.4]){
  for(const x of [px-.78,px+.78])for(const z of [-.65,.7])box(group,.12,.7,.13,x,.48,z,metal,.015);
  for(const z of [-.65,.7])box(group,1.8,.12,.14,px,.18,z,metal,.015);
  for(const x of [px-.78,px+.78])box(group,.14,.12,1.45,x,.74,.03,metal,.015);
  box(group,1.55,.13,1.22,px,1.04,-.13,metal,.025);
  const drum=new THREE.Group();drum.position.set(px,1.91,0);group.add(drum);
  const points=[new THREE.Vector2(.61,-.77),new THREE.Vector2(.9,-.67),new THREE.Vector2(1.06,-.45),new THREE.Vector2(1.08,.3),new THREE.Vector2(1.02,.58),new THREE.Vector2(.86,.78),new THREE.Vector2(.71,.85)];
  const shell=new THREE.Mesh(new THREE.LatheGeometry(points,80),metal);shell.rotation.x=Math.PI/2;shell.castShadow=true;drum.add(shell);
  ring(drum,.79,.045,0,0,.78,trim);ring(drum,.69,.095,0,0,.82,dark);
  const face=new THREE.Mesh(new THREE.CircleGeometry(.61,10),dark);face.position.z=.84;drum.add(face);
  for(const a of [0,Math.PI*2/3,Math.PI*4/3]){const bracket=box(drum,.065,.58,.04,Math.sin(a)*.3,Math.cos(a)*.3,.87,metal,.008);bracket.rotation.z=-a;}
  cyl(drum,.045,.1,0,0,.92,yellow,'z');
  box(group,.51,.49,.54,px,.81,-.86,dark,.07);cyl(group,.23,.24,px,.81,-1.1,metal,'z');drums.push(drum);
 }
 beam(group,[-1.4,.8,-.7],[1.4,.8,-.7],.05,cream);
 return{group,animate:(active,t,dt)=>{if(active)drums.forEach(d=>d.rotation.z+=dt*.35);},hotspots:[{name:'滚筒主体',text:'参考现场照片中的不锈钢滚筒轮廓，表面与开口比例为目测近似。',pos:[-1.4,2.9,.25]},{name:'正面封盖',text:'正面封盖、边缘环及加固件的外观示意。',pos:[1.4,1.92,.95]},{name:'支架与连接',text:'底部金属支架和可见连接管路的简化表示。',pos:[-1.4,.55,.65]}]};}
function makeConveyor(){const group=new THREE.Group(),marks=[];
 box(group,5.6,.25,1.55,0,1.18,0,metal,.025);box(group,5.2,.07,1.27,0,1.35,0,blue,.01);
 for(const z of [-.77,.77])box(group,5.5,.2,.055,0,1.45,z,blue,.01);
 for(const x of [-2.3,2.3])for(const z of [-.62,.62]){box(group,.12,1.06,.12,x,.61,z,metal,.015);box(group,.22,.08,.22,x,.1,z,dark,.01);}
 for(const z of [-.62,.62])box(group,4.7,.12,.12,0,.35,z,metal,.015);
 for(const x of [-2.6,2.6])cyl(group,.11,1.25,x,1.27,0,metal,'z');
 box(group,.68,2.45,1.7,-.35,1.7,0,metal,.04);
 box(group,.18,1.03,1.2,-.35,1.4,0,dark,.02);
 box(group,.28,.12,1.3,-.35,2.48,0,trim,.015);
 ring(group,.27,.045,-.35,2.66,.9,dark);
 for(const a of [0,Math.PI*2/3,Math.PI*4/3])beam(group,[-.35,2.66,.91],[-.35+Math.sin(a)*.25,2.66+Math.cos(a)*.25,.91],.025,dark);
 cyl(group,.055,.07,-.35,2.66,.92,trim,'z');
 box(group,.7,.55,.6,1.6,.75,0,dark,.05);cyl(group,.2,.3,1.6,.75,.45,metal,'z');
 for(let i=0;i<11;i++){const m=box(group,.025,.009,1.12,-2.4+i*.47,1.391,0,new THREE.MeshStandardMaterial({color:0x548cca,roughness:.8}),0);marks.push(m);}
 return{group,animate:(active,t,dt)=>{if(active)marks.forEach(m=>{m.position.x+=dt*.38;if(m.position.x>2.5)m.position.x=-2.5;});},hotspots:[{name:'蓝色输送带',text:'参照照片中的蓝色输送表面和两侧挡边。动画只演示表面移动。',pos:[1.3,1.52,.65]},{name:'竖向机架',text:'参考照片中的竖向机架与手轮，未展示内部刀具或真实切割过程。',pos:[-.35,2.8,.8]},{name:'机架支撑',text:'不锈钢支撑腿及底部连接件的简化外观。',pos:[2.3,.6,.68]}]};}
const models={vacuum:makeVacuum(),tumbler:makeTumbler(),conveyor:makeConveyor()};
Object.values(models).forEach(m=>{scene.add(m.group);m.group.visible=false;});
const info={vacuum:{title:'双室真空包装机',description:'以照片中的双室台面、翻盖结构、控制面板和脚轮为参考，观察不锈钢设备的外部结构。',photo:4,index:1,action:'翻盖演示'},tumbler:{title:'滚筒式设备',description:'以现场并排放置的两台滚筒式设备为参考，展示筒体、封盖与支撑架。具体型号和用途以工厂确认为准。',photo:9,index:2,action:'筒体转动'},conveyor:{title:'输送与切割设备',description:'参考蓝色输送带、竖向机架与手轮的组合外观。模型不还原内部切割机构或实际运行参数。',photo:2,index:3,action:'输送演示'}};
const controls=new OrbitControls(camera,renderer.domElement);controls.target.copy(initialTarget);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=6;controls.maxDistance=15;controls.minPolarAngle=.22;controls.maxPolarAngle=Math.PI*.49;controls.autoRotateSpeed=.6;controls.update();
let current='vacuum',animation=false,reset=false;
const autoButton=document.querySelector('#auto-model'),animButton=document.querySelector('#animate-model'),hotspotLayer=document.querySelector('#hotspots');
function resetButtons(){autoButton.setAttribute('aria-pressed',String(controls.autoRotate));autoButton.innerHTML=`${controls.autoRotate?'Ⅱ':'◎'} <span>${controls.autoRotate?'暂停旋转':'自动旋转'}</span>`;animButton.setAttribute('aria-pressed',String(animation));animButton.innerHTML=`${animation?'Ⅱ':'▷'} <span>${animation?'结束演示':info[current].action}</span>`;}
function showPart(index){const part=models[current].hotspots[index];const readout=document.querySelector('#part-readout');readout.querySelector('strong').textContent=part.name;readout.querySelector('p').textContent=part.text;hotspotLayer.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===index));}
function selectModel(id){current=id;animation=false;reset=true;controls.autoRotate=false;Object.entries(models).forEach(([key,m])=>{m.group.visible=key===id;});document.querySelectorAll('[data-model]').forEach(b=>{const on=b.dataset.model===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});document.querySelector('#model-title').textContent=info[id].title;document.querySelector('#model-description').textContent=info[id].description;document.querySelector('#model-index').textContent=`MODEL 0${info[id].index} / 03`;hotspotLayer.innerHTML=models[id].hotspots.map((p,i)=>`<button class="hotspot" data-part="${i}" aria-label="查看部件：${p.name}">${i+1}</button>`).join('');hotspotLayer.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>showPart(i));showPart(0);resetButtons();}
document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>selectModel(b.dataset.model)));
document.querySelector('#reset-model').onclick=()=>{reset=true;controls.autoRotate=false;resetButtons();};autoButton.onclick=()=>{reset=false;controls.autoRotate=!controls.autoRotate;resetButtons();};animButton.onclick=()=>{animation=!animation;resetButtons();};controls.addEventListener('start',()=>{reset=false;});
document.querySelector('#machine-reference').onclick=()=>document.dispatchEvent(new CustomEvent('show-machine-photo',{detail:info[current].photo}));
const observer=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();});observer.observe(host);
selectModel('vacuum');loading.hidden=true;
const temp=new THREE.Vector3();let last=performance.now(),isVisible=false;
const intersection=new IntersectionObserver(entries=>{isVisible=entries[0].isIntersecting;},{rootMargin:'150px'});intersection.observe(host);
renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.05);last=now;if(!isVisible||document.hidden)return;if(reset){const t=1-Math.exp(-6*dt);camera.position.lerp(initialCamera,t);controls.target.lerp(initialTarget,t);if(camera.position.distanceTo(initialCamera)<.01)reset=false;}controls.update(dt);models[current].animate(animation,now/1000,dt);const size=host.getBoundingClientRect();hotspotLayer.querySelectorAll('button').forEach((b,i)=>{temp.fromArray(models[current].hotspots[i].pos).applyMatrix4(models[current].group.matrixWorld).project(camera);b.hidden=temp.z>1||Math.abs(temp.x)>1||Math.abs(temp.y)>1;b.style.left=`${(temp.x*.5+.5)*size.width}px`;b.style.top=`${(-temp.y*.5+.5)*size.height}px`;});renderer.render(scene,camera);});
window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);observer.disconnect();intersection.disconnect();controls.dispose();env.dispose();sharedTextures.forEach(t=>t.dispose());const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)[].concat(o.material).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();},{once:true});
}catch(e){console.error(e);loading.hidden=false;loading.textContent='当前环境无法显示 3D 模型。您仍可浏览全部工厂实拍照片。';document.querySelectorAll('.model-controls button,[data-model]').forEach(b=>b.disabled=true);document.querySelector('#machine-reference').onclick=()=>document.dispatchEvent(new CustomEvent('show-machine-photo',{detail:4}));}


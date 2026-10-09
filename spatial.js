import * as THREE from 'three';

const journey=document.querySelector('#spatial-gallery');
const host=document.querySelector('#spatial-canvas');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pieces=[
  {key:'arc',title:'The Arc',material:'BENT WALNUT / MOSS VELVET',src:'assets/hero.webp',x:4.5,z:0,ratio:1672/941},
  {key:'shell',title:'The Shell',material:'AMERICAN WALNUT / IVORY BOUCLÉ',src:'assets/shell.webp',x:-4.5,z:-14,ratio:1},
  {key:'conch',title:'The Conch',material:'AMERICAN WALNUT / OATMEAL LINEN',src:'assets/conch.webp',x:4.5,z:-28,ratio:1}
];
const clamp=n=>Math.max(0,Math.min(1,n));
let renderer,visible=false,raf=0,current=0,target=0,pointerX=0,pointerY=0,lastIndex=-1;
let camera,scene;
const positions=document.querySelectorAll('[data-gallery-position]');
function progress(){const rect=journey.getBoundingClientRect();return clamp(-rect.top/Math.max(1,journey.offsetHeight-innerHeight));}
positions.forEach(button=>button.addEventListener('click',()=>{const value=Number(button.dataset.galleryPosition)/2;const top=scrollY+journey.getBoundingClientRect().top+(journey.offsetHeight-innerHeight)*value;scrollTo({top,behavior:reduced.matches?'instant':'smooth'});}));
function updateLabel(p){const index=Math.round(p*2);if(index===lastIndex)return;lastIndex=index;const piece=pieces[index];document.querySelector('#spatial-index').textContent=`0${index+1} / 03`;document.querySelector('#spatial-title').textContent=piece.title;document.querySelector('#spatial-material').textContent=piece.material;document.querySelector('#spatial-discover').dataset.product=piece.key;positions.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));}
function render(){raf=0;if(!visible||!renderer)return;target=progress();current=reduced.matches?Math.round(target*2)/2:current+(target-current)*.055;updateLabel(current);const location=current*2;const index=Math.min(1,Math.floor(location));const blend=location-index;const ease=blend*blend*(3-2*blend);const first=pieces[index],second=pieces[index+1];const lookX=THREE.MathUtils.lerp(first.x,second.x,ease);const lookZ=THREE.MathUtils.lerp(first.z,second.z,ease);const aspect=host.clientWidth/host.clientHeight;const distance=aspect<.8?22:11;camera.position.set((reduced.matches?0:pointerX*.6),3.35+(reduced.matches?0:pointerY*.3),distance-current*28);camera.lookAt(lookX,3.1,lookZ);renderer.render(scene,camera);raf=requestAnimationFrame(render);}
function resize(){if(!renderer)return;const width=host.clientWidth,height=host.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<701?1.3:1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.appendChild(renderer.domElement);
  scene=new THREE.Scene();scene.background=new THREE.Color('#17110d');scene.fog=new THREE.FogExp2('#17110d',.017);
  camera=new THREE.PerspectiveCamera(43,1,.1,160);
  scene.add(new THREE.HemisphereLight(0xf6ddbd,0x18110c,2.1));
  const floorMaterial=new THREE.MeshStandardMaterial({color:0x302218,roughness:.5,metalness:.22});
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,100),floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.set(0,-.1,-22);scene.add(floor);
  const wood=new THREE.MeshStandardMaterial({color:0x342216,roughness:.48,metalness:.12});
  const bronze=new THREE.MeshStandardMaterial({color:0xb58a51,roughness:.26,metalness:.8});
  const dark=new THREE.MeshStandardMaterial({color:0x211810,roughness:.9});
  const lightMaterial=new THREE.MeshBasicMaterial({color:0xe6bc80});
  function box(w,h,d,material,x,y,z){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);return mesh;}
  // Architecture stays in world space while the camera travels between exhibits.
  for(let z=12;z>-54;z-=7){
    const arch=new THREE.Group();arch.add(box(.12,8,.18,bronze,-10,4,z),box(.12,8,.18,bronze,10,4,z),box(20,.12,.18,bronze,0,8,z));scene.add(arch);
    scene.add(box(.035,7,.035,lightMaterial,-9.7,3.6,z),box(.035,7,.035,lightMaterial,9.7,3.6,z));
    for(let x=-10;x<=10;x+=2)scene.add(box(.016,.01,6.9,wood,x,0,z-3.5));
  }
  const loader=new THREE.TextureLoader();
  pieces.forEach((piece,index)=>{
    const group=new THREE.Group();group.position.set(piece.x,3.2,piece.z);group.rotation.y=piece.x>0?-.22:.22;
    const width=piece.ratio>1?7.8:5.8,height=piece.ratio>1?4.39:5.8;
    group.add(box(width+.28,height+.28,.28,wood,0,0,-.17));
    group.add(box(width+.07,height+.07,.035,bronze,0,0,-.015));
    const texture=loader.load(piece.src);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
    const photo=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));photo.position.z=.02;group.add(photo);
    group.add(box(width+.6,.12,.7,bronze,0,-height/2-.2,-.05));
    group.add(box(width+.6,.025,.035,lightMaterial,0,height/2+.17,.08));
    scene.add(group);
    const pedestal=box(width+.5,.35,1.4,dark,piece.x,.1,piece.z);scene.add(pedestal);
    const light=new THREE.PointLight(0xffca87,24,13,2);light.position.set(piece.x,7,piece.z+2);scene.add(light);
    // A sculptural metal orbit gives each room a distinct physical foreground.
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.2,.035,12,96),bronze);ring.position.set(piece.x>0?1.2:-1.2,1.65,piece.z+2.5);ring.rotation.set(.3,index*.4+.35,-.2);scene.add(ring);
    const plinth=box(1.7,.6,1.7,dark,ring.position.x,.2,ring.position.z);scene.add(plinth);
  });
  const particles=new Float32Array(180*3);for(let i=0;i<180;i++){particles[i*3]=(Math.random()-.5)*20;particles[i*3+1]=Math.random()*8;particles[i*3+2]=10-Math.random()*55;}
  const particleGeometry=new THREE.BufferGeometry();particleGeometry.setAttribute('position',new THREE.BufferAttribute(particles,3));scene.add(new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:0xd5ad70,size:.025,transparent:true,opacity:.45,depthWrite:false})));
  resize();current=progress();
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf)render();else if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}},{rootMargin:'100px'});observer.observe(journey);
  host.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const rect=host.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width*2-1;pointerY=-(event.clientY-rect.top)/rect.height*2+1;});host.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer.domElement.style.visibility='hidden';});
  addEventListener('resize',resize);document.querySelector('#spatial-status').textContent='LIVE 3D / SCROLL TO EXPLORE';
}catch(error){host.hidden=true;document.querySelector('#spatial-status').textContent='THE AVORA COLLECTION';console.warn('Spatial gallery unavailable; photographic view retained.',error);}

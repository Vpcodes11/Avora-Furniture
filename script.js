const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const products = {
  arc: {name:'The Arc',image:'assets/hero.webp',alt:'Olive velvet Arc chair with a flowing walnut frame',description:'An expressive loop of walnut embraces a generous velvet seat. The Arc brings sculptural presence to a quiet corner, inviting you to slow down and settle in.',frame:'Bent walnut',fabric:'Moss velvet',character:'Expressive / Sculptural'},
  shell: {name:'The Shell',image:'assets/shell.webp',alt:'Ivory bouclé Shell chair enclosed in curved walnut',description:'A softly cocooning seat held within a curved walnut shell. Tactile bouclé and an embracing silhouette bring a sense of quiet comfort to your space.',frame:'American walnut',fabric:'Ivory bouclé',character:'Embracing / Tactile'},
  conch: {name:'The Conch',image:'assets/conch.webp',alt:'Oatmeal linen Conch chair with an open walnut frame',description:'A low, organic silhouette with a flowing open frame. The Conch pairs the warmth of walnut with softly padded linen for an easy, unhurried kind of comfort.',frame:'American walnut',fabric:'Oatmeal linen',character:'Organic / Relaxed'}
};
let saved = new Set();
try { saved = new Set(JSON.parse(localStorage.getItem('avora-saved') || '[]').filter(key => products[key])); } catch {}
let showingSaved = false;
let toastTimer;
function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2500); }
function renderSaved() {
  $$('#collection [data-save]').forEach(button=>{const active=saved.has(button.dataset.save);button.setAttribute('aria-pressed',String(active));button.textContent=active?'♥':'♡';button.setAttribute('aria-label',`${active?'Unsave':'Save'} ${products[button.dataset.save].name}`);});
  $('#saved-count').textContent=saved.size;
  $$('[data-card]').forEach(card=>card.hidden=showingSaved&&!saved.has(card.dataset.card));
  $('#saved-empty').hidden=!(showingSaved&&saved.size===0);
  $('#saved-toggle').setAttribute('aria-pressed',String(showingSaved));
}
$$('[data-save]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.save;if(saved.has(key)){saved.delete(key);toast('Piece removed from your favourites');}else{saved.add(key);toast(`${products[key].name} saved to your favourites`);}try{localStorage.setItem('avora-saved',JSON.stringify([...saved]));}catch{}renderSaved();}));
$('#saved-toggle').addEventListener('click',()=>{showingSaved=!showingSaved;renderSaved();});
$('#show-all').addEventListener('click',()=>{showingSaved=false;renderSaved();});
renderSaved();

const menu=$('#mobile-menu');
const menuButton=$('.menu-toggle');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');}
menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));menuButton.setAttribute('aria-label',menu.hidden?'Open menu':'Close menu');});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});

const dialog=$('#product-dialog');
let currentProduct='arc';
let opener;
$$('[data-product]').forEach(button=>button.addEventListener('click',()=>{
  currentProduct=button.dataset.product;opener=button;const item=products[currentProduct];
  $('#dialog-title').textContent=item.name;$('#dialog-description').textContent=item.description;
  $('#dialog-image').src=item.image;$('#dialog-image').alt=item.alt;
  $('#dialog-frame').textContent=item.frame;$('#dialog-fabric').textContent=item.fabric;$('#dialog-character').textContent=item.character;
  $('.dialog-visual').classList.remove('is-zoomed');$('#image-zoom').setAttribute('aria-pressed','false');$('#image-zoom').textContent='View closer +';
  dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;
}));
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});});
$('#image-zoom').addEventListener('click',()=>{const active=$('.dialog-visual').classList.toggle('is-zoomed');$('#image-zoom').setAttribute('aria-pressed',String(active));$('#image-zoom').textContent=active?'Full view −':'View closer +';});
$('#add-to-brief').addEventListener('click',()=>{const name=products[currentProduct].name;const input=$$('#brief-form input[name=pieces]').find(e=>e.value===name);input.checked=true;$('#brief-result').hidden=true;dialog.close();$('#contact').scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth'});toast(`${name} added to your design brief`);});

const materials={
  walnut:{title:'Character in every curve.',description:'The rich, irregular grain of walnut brings warmth to our sculptural silhouettes. Each frame follows the material’s natural movement, giving every curve its own character.',note:'FOUND IN / THE ARC, THE SHELL & THE CONCH',image:'assets/hero.webp',alt:'Walnut frame on the Arc lounge chair',index:'01 / WALNUT'},
  velvet:{title:'Depth you can feel.',description:'Moss velvet brings a soft, changing sheen to the Arc. Light moves across its surface, shifting the tone from deep olive to warm green and revealing the generous shape of the seat.',note:'FOUND IN / THE ARC',image:'assets/hero.webp',alt:'Moss velvet upholstery on the Arc lounge chair',index:'02 / VELVET'},
  boucle:{title:'An invitation to settle in.',description:'Ivory bouclé adds a gentle, looped texture to the Shell. Its warm neutral shade softens the sculptural walnut frame, creating a piece that feels as welcoming as it looks.',note:'FOUND IN / THE SHELL',image:'assets/shell.webp',alt:'Textured ivory bouclé upholstery on the Shell chair',index:'03 / BOUCLÉ'}
};
function selectMaterial(button){const key=button.dataset.material,item=materials[key];$$('[data-material]').filter(e=>e.matches('button')).forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});$('#material-panel').setAttribute('aria-labelledby',button.id);$('#material-name').textContent=item.title;$('#material-description').textContent=item.description;$('#material-note').textContent=item.note;$('#material-index').textContent=item.index;$('#material-image').src=item.image;$('#material-image').alt=item.alt;$('.material-visual').dataset.material=key;}
const materialTabs=$$('.material-tabs button');
materialTabs.forEach((button,index)=>{button.addEventListener('click',()=>selectMaterial(button));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%materialTabs.length;if(event.key==='ArrowLeft')next=(index+materialTabs.length-1)%materialTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=materialTabs.length-1;if(next!==undefined){event.preventDefault();materialTabs[next].focus();selectMaterial(materialTabs[next]);}});});

let briefText='';let briefURL;
$('#brief-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const selected=data.getAll('pieces');briefText=`AVORA — MY DESIGN BRIEF\n\nPrepared for: ${data.get('name').trim()}\nSpace: ${data.get('space')}\nFavourite pieces: ${selected.length?selected.join(', '):'Open to ideas'}\n\nMY VISION\n${data.get('vision').trim()}\n\nMATERIAL PALETTE\n${selected.map(name=>{const item=Object.values(products).find(p=>p.name===name);return `${name}: ${item.frame} / ${item.fabric}`;}).join('\n')||'To be explored'}\n\nAVORA is an imagined design house. All pieces are creative concepts, not products available for purchase.\n`;if(briefURL)URL.revokeObjectURL(briefURL);briefURL=URL.createObjectURL(new Blob([briefText],{type:'text/plain;charset=utf-8'}));$('#brief-download').href=briefURL;$('#brief-result').hidden=false;$('#brief-result').scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth',block:'nearest'});});
$('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(briefText);toast('Design brief copied');}catch{toast('Use Download your brief to save a copy');}});
$('#brief-form').addEventListener('input',()=>{$('#brief-result').hidden=true;});
saved.forEach(key=>{const input=$$('#brief-form input[name=pieces]').find(e=>e.value===products[key].name);if(input)input.checked=true;});

const hero=$('.hero');let pointerX=0,pointerY=0,currentX=0,currentY=0,frame=0;
function animateScene(){frame=0;if(reduceMotion.matches||window.innerWidth<701)return;currentX+=(pointerX-currentX)*.07;currentY+=(pointerY-currentY)*.07;hero.style.setProperty('--room-x',`${-currentX*12}px`);hero.style.setProperty('--room-y',`${-currentY*7}px`);hero.style.setProperty('--chair-x',`${currentX*24}px`);hero.style.setProperty('--chair-y',`${currentY*12}px`);hero.style.setProperty('--hero-yaw',`${currentX*2.4}deg`);if(Math.abs(pointerX-currentX)>.005||Math.abs(pointerY-currentY)>.005)frame=requestAnimationFrame(animateScene);}
function scheduleScene(){if(!frame)frame=requestAnimationFrame(animateScene);}
hero.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const r=hero.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width*2-1;pointerY=(event.clientY-r.top)/r.height*2-1;scheduleScene();});
hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;scheduleScene();});

$$('.product-card').forEach(card=>{
  card.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||reduceMotion.matches||innerWidth<701)return;const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;card.classList.add('is-tilting');card.style.setProperty('--tilt-x',`${(y-.5)*-6}deg`);card.style.setProperty('--tilt-y',`${(x-.5)*8}deg`);card.style.setProperty('--tilt-lift','-6px');card.style.setProperty('--light-x',`${x*100}%`);card.style.setProperty('--light-y',`${y*100}%`);});
  card.addEventListener('pointerleave',()=>{card.classList.remove('is-tilting');card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');card.style.setProperty('--tilt-lift','0px');});
});
const materialPlane=$('.material-visual');
materialPlane.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||reduceMotion.matches||innerWidth<701)return;const r=materialPlane.getBoundingClientRect();materialPlane.style.setProperty('--material-yaw',`${((event.clientX-r.left)/r.width-.5)*10}deg`);materialPlane.style.setProperty('--material-pitch',`${((event.clientY-r.top)/r.height-.5)*-7}deg`);});
materialPlane.addEventListener('pointerleave',()=>{materialPlane.style.removeProperty('--material-yaw');materialPlane.style.removeProperty('--material-pitch');});
let depthFrame=0;
function updateScrollDepth(){depthFrame=0;if(reduceMotion.matches)return;const r=hero.getBoundingClientRect(),travel=Math.max(0,Math.min(1,-r.top/r.height));$('.scene').style.setProperty('--scene-scale',String(1+travel*.08));$('.scene').style.setProperty('--scene-pitch',`${travel*-2}deg`);const statement=$('.statement'),rect=statement.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)statement.style.setProperty('--ring-turn',`${(1-rect.top/innerHeight)*90-70}deg`);}
addEventListener('scroll',()=>{if(!depthFrame)depthFrame=requestAnimationFrame(updateScrollDepth);},{passive:true});

// Resolve the opening screen against actual local image and font readiness.
const loadingRoots = [document.querySelector('main'),document.querySelector('header'),document.querySelector('footer'),menu];
loadingRoots.forEach(element=>element.inert=true);
let loaderFinished=false;
let assetsReady=0;
const loadingStarted=performance.now();
const loaderTrack=$('.loader-track');
function updateLoading(){const value=Math.round(assetsReady/6*100);$('#loader-number').textContent=String(value).padStart(2,'0');$('#loader-fill').style.width=`${value}%`;loaderTrack.setAttribute('aria-valuenow',String(value));}
function finishLoading(){if(loaderFinished)return;loaderFinished=true;clearTimeout(loaderDeadline);$('#loader-number').textContent='100';$('#loader-fill').style.width='100%';loaderTrack.setAttribute('aria-valuenow','100');document.documentElement.classList.remove('is-loading');loadingRoots.forEach(element=>element.inert=false);$('#page-loader').setAttribute('aria-hidden','true');}
const loaderDeadline=setTimeout(finishLoading,8000);
const loadingAssets=['assets/room.webp','assets/arc-cutout-v2.webp','assets/hero.webp','assets/shell.webp','assets/conch.webp'].map(src=>new Promise(resolve=>{const image=new Image();const done=()=>{assetsReady++;updateLoading();resolve();};image.onload=()=>{if(image.decode)image.decode().catch(()=>{}).then(done);else done();};image.onerror=done;image.src=src;}));
loadingAssets.push((document.fonts?document.fonts.ready:Promise.resolve()).catch(()=>{}).then(()=>{assetsReady++;updateLoading();}));
Promise.all(loadingAssets).then(()=>setTimeout(finishLoading,Math.max(0,(reduceMotion.matches?0:1500)-(performance.now()-loadingStarted))));

if('IntersectionObserver' in window&&!reduceMotion.matches){
  document.documentElement.classList.add('motion-ready');
  const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}});},{threshold:.08});
  $$('.intro>div,.section-heading,.product-card,.material-visual,.material-content,.story-copy,.design-notes h2,.faq-list,.contact>div,.contact form').forEach(element=>{element.classList.add('reveal');revealObserver.observe(element);});
}

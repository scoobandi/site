const hero = document.querySelector('.hero');
hero.dataset.enhanced = 'true';
const routes = JSON.parse(document.getElementById('hero-routes').textContent);
const figures = [...hero.querySelectorAll('.figure')];
const pictures = figures.map(figure => figure.querySelector('img'));
let active = 0;
let gesture = null;
const localQA = ['127.0.0.1','localhost'].includes(location.hostname);
const query = localQA ? new URLSearchParams(location.search) : new URLSearchParams();
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(){ hero.dataset.reducedMotion = String(reduce.matches || query.get('motion') === 'reduce'); }
setMotion(); reduce.addEventListener('change',setMotion);
function failed(index){
  const fallback = document.createElement('div');
  fallback.className = 'art-fallback';
  fallback.textContent = routes[index].name;
  pictures[index].replaceWith(fallback);
  figures[index].dataset.ready = 'true';
}
pictures.forEach((picture,index)=>{
  picture.addEventListener('load',()=>{ figures[index].dataset.ready='true'; });
  picture.addEventListener('error',()=>failed(index),{once:true});
  if(picture.complete && picture.naturalWidth) figures[index].dataset.ready='true';
});
function load(index,priority='low'){
  const picture=pictures[index];
  picture.fetchPriority=priority;
  if(query.get('art') === 'off'){picture.removeAttribute('srcset');picture.src='/missing-for-local-qa.webp';return;}
  if(!picture.getAttribute('src')){
    if(picture.dataset.srcset)picture.srcset=picture.dataset.srcset;
    picture.src=picture.dataset.src;
  }
}
function show(index){
  active=(index+routes.length)%routes.length;
  const route=routes[active];
  // The action and copy respond immediately. A named static placeholder fills any undecoded art.
  load(active,'high');
  hero.dataset.active=String(active);
  hero.style.setProperty('--stage',route.color);
  const scene=hero.querySelector('.scene');
  scene.className='scene state-'+active;
  figures.forEach((figure,i)=>{figure.className='figure figure-'+i+' '+['center','right','back','left'][(i-active+routes.length)%routes.length];});
  hero.querySelector('.eyebrow').textContent=route.detail || 'HERE TO HELP';
  hero.querySelector('#route-title').textContent=route.answer;
  hero.querySelector('.route-copy p').textContent=route.description;
  const action=hero.querySelector('.action');
  action.href=route.href;
  action.firstChild.textContent=route.action;
  const caption=hero.querySelectorAll('.scene-caption span');
  caption[0].textContent=route.name;caption[1].textContent='0'+(active+1)+' / 04';
  figures.forEach((figure,i)=>{figure.dataset.name=routes[i].name;});
  load((active+1)%routes.length,'low');
}
hero.querySelector('[aria-label="Previous choice"]').addEventListener('click',()=>show(active-1));
hero.querySelector('[aria-label="Next choice"]').addEventListener('click',()=>show(active+1));
const scene=hero.querySelector('.scene');
scene.addEventListener('pointerdown',event=>{
  if(!event.isPrimary || event.button!==0 || event.target.closest('button'))return;
  gesture={x:event.clientX,y:event.clientY,id:event.pointerId};
  scene.setPointerCapture(event.pointerId);
});
scene.addEventListener('pointerup',event=>{
  if(!gesture || gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  gesture=null;
  if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)*1.5)show(active+(dx<0?1:-1));
});
['pointercancel','lostpointercapture'].forEach(type=>scene.addEventListener(type,()=>{gesture=null;}));
figures.forEach((figure,i)=>{figure.dataset.name=routes[i].name;});
if(query.get('art')==='off')pictures.forEach((_,i)=>load(i));
function warm(){
  // Start the two visible neighbors only after the opening illustration has decoded.
  Promise.resolve(pictures[0].decode?.()).catch(()=>{}).then(()=>{
    const next=()=>{load(1);load(3);};
    if('requestIdleCallback' in window)requestIdleCallback(next,{timeout:1500});else setTimeout(next,100);
  });
}
if(pictures[0].complete)warm();else pictures[0].addEventListener('load',warm,{once:true});


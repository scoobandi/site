// Old saved resource links now lead to the consultation, never a quiz.
if(document.querySelector('.hero')&&location.hash==='#dog-assessment')location.replace('/consult/');
if(['127.0.0.1','localhost'].includes(location.hostname) && new URLSearchParams(location.search).has('measure')){const check=document.createElement('script');check.src='/local-performance-check.js';document.head.append(check);}
document.querySelectorAll('.j-menu, .menu-wrapper').forEach(menu=>{
 const summary=menu.querySelector('summary');
 menu.addEventListener('toggle',()=>{if(menu.open)menu.querySelector('nav a')?.focus();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;summary.focus();}});
 document.addEventListener('pointerdown',event=>{if(!menu.contains(event.target))menu.open=false;});
 menu.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
});

// Original proof is always an ordinary image link; the dialog is an enhancement.
const reviewDialog=document.getElementById('review-dialog');
if(reviewDialog){
 let returnFocus;
 document.querySelectorAll('[data-review-image]').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();returnFocus=link;
  reviewDialog.querySelector('img').src=link.dataset.reviewImage;
  reviewDialog.querySelector('img').alt='Original review from '+link.dataset.reviewTitle;
  reviewDialog.querySelector('h2').textContent=link.dataset.reviewTitle;
  reviewDialog.querySelector('a').href=link.href;
  reviewDialog.querySelector('.a-dialog-disclosure').textContent=link.closest('section, aside')?.querySelector('.a-review-disclosure')?.textContent||'';
  reviewDialog.showModal();
 }));
 reviewDialog.querySelector('button').addEventListener('click',()=>reviewDialog.close());
 reviewDialog.addEventListener('close',()=>returnFocus?.focus());
 reviewDialog.addEventListener('click',event=>{if(event.target===reviewDialog&&event.clientX<reviewDialog.getBoundingClientRect().left)reviewDialog.close();});
}
document.querySelectorAll('[data-file-video]').forEach(box=>box.querySelector('button').addEventListener('click',()=>{
 const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=box.dataset.fileVideo;
 video.setAttribute('aria-label',box.dataset.videoTitle);video.poster=box.querySelector('img').src;
 if(box.dataset.captions){const track=document.createElement('track');track.kind='captions';track.srclang='en';track.label='English';track.src=box.dataset.captions;track.default=true;video.append(track);}
 video.addEventListener('play',()=>{document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});});
 const status=document.createElement('p');status.className='a-file-status';status.setAttribute('role','status');status.textContent='Loading video…';box.append(status);
 video.addEventListener('playing',()=>{box.dataset.playback='playing';status.hidden=true;});
 video.addEventListener('pause',()=>{box.dataset.playback='paused';});
 video.addEventListener('error',()=>{box.dataset.playback='error';status.hidden=false;status.textContent='The video could not load. Use the direct link below.';});
 box.querySelector('button').replaceWith(video);box.dataset.loaded='true';
 video.play().catch(()=>{status.hidden=false;status.textContent='Press play in the video controls to start.';});
}));

document.querySelectorAll('[data-video]').forEach(box=>box.querySelector('button').addEventListener('click',()=>{
 const frame=document.createElement('iframe');frame.src='https://www.youtube.com/embed/'+box.dataset.video+'?rel=0';
 frame.title='Real coaching session with Joel Harrison';frame.allow='fullscreen; picture-in-picture';frame.allowFullscreen=true;
 const status=document.createElement('p');status.className='a-load-state';status.textContent='Loading the coaching video…';status.setAttribute('role','status');box.append(status);
 frame.addEventListener('load',()=>status.remove());
 box.querySelector('button').replaceWith(frame);box.dataset.loaded='true';frame.focus();
}));
// Load a calendar only after its format is selected. Cache opened frames so
// switching formats does not reset an unfinished calendar interaction.
const calendarPanes=new Map();
document.querySelectorAll('input[name="consult-format"]').forEach(input=>input.addEventListener('change',()=>{
 const local=input.value==='local';const label=local?'In-person':'Zoom';
 const box=document.getElementById('calendar-frame');
 const fallback=document.getElementById('calendar-fallback');
 document.getElementById('calendar-title').textContent=label+' consultation';
 document.getElementById('calendar-description').textContent=local?'Meet in Sharpsburg, Georgia. See preparation details below.':'Meet from home. Local owners can choose Zoom too.';
 document.getElementById('calendar-placeholder').hidden=true;
 box.hidden=false;fallback.hidden=false;fallback.href=input.dataset.calendarUrl;fallback.dataset.calendarFormat=input.value;
 calendarPanes.forEach((pane,key)=>{pane.hidden=key!==input.value;});
 if(calendarPanes.has(input.value)){calendarPanes.get(input.value).hidden=false;return;}
 const pane=document.createElement('div');pane.className='a-calendar-pane';pane.dataset.format=input.value;
 const status=document.createElement('p');status.className='a-load-state';status.setAttribute('role','status');status.textContent='Loading the '+label.toLowerCase()+' calendar…';
 const frame=document.createElement('iframe');frame.title=label+' consultation calendar';frame.src=input.dataset.calendarUrl;
 frame.addEventListener('load',()=>{status.textContent=label+' calendar. Select an available day and time below.';});
 pane.append(status,frame);box.append(pane);calendarPanes.set(input.value,pane);
}));

/* Reviewed local instrumentation. Disabled until live tag ownership and consent are verified. */
(()=>{
 'use strict';
 if(window.ScoobMeasurement)return;
 const node=document.getElementById('measurement-settings');if(!node)return;
 const cfg=JSON.parse(node.textContent);
 const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
 const debug=local&&new URLSearchParams(location.search).get('measurement_debug')==='1';
 const allowed=cfg.allowedHosts.includes(location.hostname);
 const events=[];let ready=false,started=false,consent={analytics:false};let status=local?'blocked_local_host':cfg.enabled?'waiting_for_consent':'disabled_local_review';
 const output=debug?document.createElement('output'):null;
 if(output){output.id='measurement-debug';output.hidden=true;document.body.append(output);}
 function update(){if(output)output.dataset.state=JSON.stringify({status,networkEnabled:ready,events});}
 function cleanCampaign(){const result={};const params=new URLSearchParams(location.search);for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']){const value=(params.get(key)||'').toLowerCase();if(/^[a-z][a-z0-9_-]{0,79}$/.test(value)&&!/[0-9]{7}/.test(value))result[key]=value;}return result;}
 function cleanLocation(){const u=new URL(cfg.canonical);for(const [k,v]of Object.entries(cleanCampaign()))u.searchParams.set(k,v);return u.href;}
 function send(name,params){if(ready)window.gtag('event',name,params);}
 function record(name,params={}){const event={event:name,page_id:cfg.pageId,...params};if(debug){events.push(event);if(events.length>100)events.shift();}send(name,{page_id:cfg.pageId,...params});update();}
 function activate(){
  if(started||!cfg.enabled||cfg.environment!=='production'||local||!allowed||!consent.analytics){update();return;}
  // Existing host/GHL/GTM tags must be reconciled first; don't create duplicate tracking.
  if(typeof window.gtag==='function'||document.querySelector('script[src*="googletagmanager.com"]')){status='blocked_existing_tag_owner';update();return;}
  started=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted'});
  window.gtag('js',new Date());
  let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
  window.gtag('config',cfg.ga4Id,{send_page_view:false,page_location:cleanLocation(),page_referrer:referrer,allow_google_signals:false,allow_ad_personalization_signals:false});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.ga4Id);document.head.append(script);
  ready=true;status='analytics_ready';send('page_view',{page_id:cfg.pageId,page_location:cleanLocation(),page_referrer:referrer,page_title:document.title});update();
 }
 function setConsent(value){
  consent.analytics=value?.analytics===true;
  if(!consent.analytics&&ready){window.gtag('consent','update',{analytics_storage:'denied'});ready=false;status='consent_denied';update();return;}
  if(consent.analytics&&started&&!ready){window.gtag('consent','update',{analytics_storage:'granted'});ready=true;status='analytics_ready';update();return;}
  activate();
 }
 function destination(url){if(url.hostname==='checkout.digitaldogschool.com')return null;if(url.hostname==='digitaldogschool.com')return'dds';return {'/consult/':'consult','/digital-dog-school/':'dds','/resources/':'resources','/about/':'about'}[url.pathname]||null;}
 function placement(a){return a.closest('footer')?'footer':a.closest('nav')?'menu':a.closest('.hero')?'hero':'body';}
 document.addEventListener('change',event=>{
  const input=event.target instanceof Element?event.target:null;
  if(input?.matches('input[name="consult-format"]')&&['local','virtual'].includes(input.value))record('booking_calendar_open',{format:input.value,entry:'embedded',booking_verified:false});
 });
 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  const a=target.closest('a[href]');if(!a)return;
  if((a.getAttribute('href')||'').startsWith('#'))return;
  let url;try{url=new URL(a.href,location.href);}catch{return;}
  if(url.hostname==='api.leadconnectorhq.com'&&['local','virtual'].includes(a.dataset.calendarFormat)){record('booking_calendar_open',{format:a.dataset.calendarFormat,entry:'direct_link',booking_verified:false});return;}
  if(url.hostname==='checkout.digitaldogschool.com'&&url.pathname.replace(/\/$/,'')==='/joindds'){record('dds_checkout_click',{placement:placement(a),payment_verified:false});return;}
  const resource={'/resources/resource-guarding/':'resource_guarding','/resources/anxiety/':'anxiety','/resources/stop-walking-your-dog/':'walks','/resources/5-insider-insights/':'training_insights'}[url.pathname];
  if(resource){record('resource_click',{resource});return;}
  if(url.hostname==='youtu.be'&&url.pathname==='/eLwt0PsuUHE'){record('resource_click',{resource:'dogs_fighting'});return;}
  const dest=destination(url);
  if(dest&&(url.origin===location.origin||cfg.allowedHosts.includes(url.hostname)))record('path_selected',{destination:dest,placement:placement(a)});
 });
 window.ScoobMeasurement=Object.freeze({setConsent});
 if(debug)record('page_view',{campaign:cleanCampaign()});
 update();
})();

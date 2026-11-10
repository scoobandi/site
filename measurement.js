/* Restored existing Google, Meta and Microsoft tracking, November 10, 2026. */
(()=>{
 'use strict';
 if(window.ScoobMeasurement)return;
 const node=document.getElementById('measurement-settings');if(!node)return;
 const cfg=JSON.parse(node.textContent);
 const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
 const allowed=cfg.allowedHosts.includes(location.hostname);
 const active=cfg.enabled===true&&cfg.environment==='production'&&!local&&allowed;
 const debug=local&&new URLSearchParams(location.search).get('measurement_debug')==='1';
 // Restore the pre-rebuild loading behavior. An explicit consent update can revoke it.
 const consent={analytics:true,advertising:true};
 const ready={google:false,meta:false,clarity:false};
 const started={google:false,meta:false,clarity:false};
 const events=[];
 const output=debug?document.createElement('output'):null;
 if(output){output.id='measurement-debug';output.hidden=true;document.body.append(output);}
 function update(){if(output)output.dataset.state=JSON.stringify({networkEnabled:active,ready,events});}
 function load(provider,src){const script=document.createElement('script');script.async=true;script.src=src;script.dataset.trackingProvider=provider;document.head.append(script);}
 function cleanCampaign(){const result={};const params=new URLSearchParams(location.search);for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']){const value=(params.get(key)||'').toLowerCase();if(/^[a-z][a-z0-9_-]{0,79}$/.test(value)&&!/[0-9]{7}/.test(value))result[key]=value;}return result;}
 function cleanLocation(){const u=new URL(cfg.canonical);for(const [k,v]of Object.entries(cleanCampaign()))u.searchParams.set(k,v);return u.href;}
 function send(name,params){
  if(ready.google&&consent.analytics)window.gtag('event',name,params);
  if(ready.meta&&consent.advertising&&name!=='page_view')window.fbq('trackCustom',name,params);
 }
 function record(name,params={}){const event={event:name,page_id:cfg.pageId,...params};if(debug){events.push(event);if(events.length>100)events.shift();}send(name,{page_id:cfg.pageId,...params});update();}
 function activate(){
  if(!active){update();return;}
  if(consent.analytics&&!started.google&&cfg.ga4Id&&!window.gtag&&!document.querySelector('script[src*="googletagmanager.com"]')){
   started.google=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
   window.gtag('js',new Date());
   let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
   window.gtag('config',cfg.ga4Id,{send_page_view:false,page_location:cleanLocation(),page_referrer:referrer,allow_google_signals:false,allow_ad_personalization_signals:false});
   load('google','https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.ga4Id));
   ready.google=true;
   window.gtag('event','page_view',{page_id:cfg.pageId,page_location:cleanLocation(),page_referrer:referrer,page_title:document.title});
  }
  if(consent.advertising&&!started.meta&&cfg.metaPixelId&&!window.fbq&&!document.querySelector('script[src*="connect.facebook.net"]')){
   started.meta=true;
   const fbq=window.fbq=function(){fbq.callMethod?fbq.callMethod.apply(fbq,arguments):fbq.queue.push(arguments);};
   window._fbq=window._fbq||fbq;fbq.push=fbq;fbq.loaded=true;fbq.version='2.0';fbq.queue=[];
   fbq('init',cfg.metaPixelId);fbq('track','PageView');
   load('meta','https://connect.facebook.net/en_US/fbevents.js');ready.meta=true;
  }
  const clarityId=(cfg.clarityIds||{})[location.hostname]||cfg.clarityId;
  if(consent.analytics&&!started.clarity&&clarityId&&!window.clarity&&!document.querySelector('script[src*="clarity.ms/tag/"]')){
   started.clarity=true;
   const clarity=window.clarity=function(){(clarity.q=clarity.q||[]).push(arguments);};
   load('clarity','https://www.clarity.ms/tag/'+encodeURIComponent(clarityId));ready.clarity=true;
  }
  update();
 }
 function setConsent(value){
  consent.analytics=value?.analytics===true;
  consent.advertising=value?.advertising===true;
  if(started.google)window.gtag('consent','update',{analytics_storage:consent.analytics?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  if(started.meta)window.fbq('consent',consent.advertising?'grant':'revoke');
  if(started.clarity)window.clarity('consentv2',{analytics_Storage:consent.analytics?'granted':'denied',ad_Storage:consent.advertising?'granted':'denied'});
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
 activate();
 if(debug)record('page_view',{campaign:cleanCampaign()});
 update();
})();

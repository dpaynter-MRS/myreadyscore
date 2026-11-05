const STANDARD_OPTIONS=[['Yes — complete and tested',100,'This is ready and we could rely on it today.'],['Partly',50,'Some pieces are in place, but there is a meaningful gap.'],['Not yet',0,'This is not currently in place.']];
const locationQuestion={id:'setting',icon:'⌂',label:'Your Household Setting',question:'Which setting best describes where your household lives?',help:'Your answer creates a short assessment around the constraints and equipment most relevant to you.',actions:'Choose a household setting.',scored:false,tip:'There is no “better” setting—each path simply prepares for different realities.',options:[['Urban / apartment','Urban / apartment','Dense neighborhood, apartment, condo, high-rise, or limited private storage.'],['Suburban / small town','Suburban / small town','Residential area with vehicle access and moderate proximity to services or a city.'],['Rural / remote','Rural / remote','Lower-density area, longer travel times, or greater reliance on private systems.']]};
function q(id,icon,label,question,help,actions,productKey,tip){return{id,icon,label,question,help,actions,productKey,tip,scored:true,options:STANDARD_OPTIONS};}
const PATH_QUESTIONS={
  'Urban / apartment':[
    q('u_go_bag','🎒','Compact Evacuation Kit','Could each person quickly carry the essentials needed to leave the building?','Think identification, medication, water, light, charging, clothing, and basic supplies.','Build a compact, carryable go-bag for each household member.','urbanGoBag','Urban evacuations may involve stairs, walking, or transit, so portability matters.'),
    q('u_exit','🏢','Building Exit','Could everyone leave safely if elevators and normal building access were unavailable?','Include two exits, stairs, an outside meeting point, and any mobility needs.','Practice an elevator-free exit and meeting plan.','urbanGoBag','A bag only helps if everyone also knows how to get out safely.'),
    q('u_water','💧','Portable Water','Can each person carry or access safe drinking water during an evacuation?','Compact containers are useful where storage and carrying capacity are limited.','Add a portable water option to each evacuation kit.','urbanWater','Plan for water you can actually carry, not only water stored at home.'),
    q('u_shelter_water','🚰','Shelter Water','Do you have a practical water plan if building service stops for several days?','Consider limited apartment storage and how you would safely replenish or treat water.','Create a compact apartment water-storage and treatment plan.','urbanWater','Sheltering and evacuating require different water strategies.'),
    q('u_phone_power','🔋','Phone Backup Power','Can you recharge essential phones if household power is unavailable?','Phones may provide alerts, maps, contacts, and transit information during disruption.','Add and routinely charge backup phone power.','urbanPower','Keep the power bank charged and store the correct cables with it.'),
    q('u_alerts','📻','Independent Alerts','Can you receive official alerts without household power or cellular data?','A compact NOAA radio provides a separate information channel.','Add and test an independent emergency radio.','urbanRadio','Dense networks can still become overloaded or unavailable.'),
    q('u_city_route','🗺️','Out-of-Area Route','Have you chosen a destination and two ways to get beyond the immediate city center?','Include walking, transit, trusted rides, and congestion in the plan.','Choose an out-of-area destination and two practical routes.','urbanGoBag','Decide where you are going before deciding what to pack.'),
    q('u_shelter','🏠','Apartment Sheltering','Could you safely remain inside for several days with limited utilities?','Cover food, water, medication, sanitation, light, temperature, and official information.','Build a compact multi-day shelter plan.','urbanRadio','A balanced urban plan supports both sheltering and leaving.'),
    q('u_contacts','🪪','Offline Information','Are contacts, medical details, routes, and building instructions available offline?','Do not rely on a single phone or cloud account for essential information.','Create a portable offline household information card.','urbanPower','A charged phone is useful; a paper fallback is dependable.')
  ],
  'Suburban / small town':[
    q('s_vehicle_kit','🚗','Vehicle Emergency Kit','Does your primary vehicle carry practical emergency and roadside supplies?','Consider weather, breakdowns, evacuation delays, and household-specific needs.','Stock and review a vehicle emergency kit.','suburbanVehicle','Your vehicle may become both transportation and temporary shelter.'),
    q('s_vehicle_ready','⛽','Vehicle Readiness','Is your evacuation vehicle maintained and usually kept above a minimum fuel level?','Fuel stations and repair services may be unavailable or crowded.','Set a fuel threshold and vehicle-readiness routine.','suburbanVehicle','Equipment works best when the vehicle itself is ready.'),
    q('s_water','💧','Stored Water','Do you have clearly counted emergency water for everyone in the household?','Include extra needs for pets, infants, medical use, and hot weather.','Build an organized household water reserve.','suburbanWater','Stackable containers can use garage or utility space efficiently.'),
    q('s_water_days','🚰','Multi-Day Water','Would your stored water last through a multi-day neighborhood outage?','Base the amount on household size and local guidance.','Increase and rotate stored water toward a multi-day supply.','suburbanWater','Count the supply rather than estimating it.'),
    q('s_power','⚡','Essential Backup Power','Can you power essential phones, lights, and small devices during an outage?','Prioritize communication, lighting, and medically necessary equipment.','Identify essential loads and add appropriate backup power.','suburbanPower','Start with essential devices instead of trying to power the whole home.'),
    q('s_power_days','🔋','Longer Outage Plan','Have you tested how long your backup power lasts and how it will be recharged?','Capacity claims are less useful than a tested household plan.','Test backup-power runtime and recharging.','suburbanPower','A short practice outage can expose missing cables and unrealistic assumptions.'),
    q('s_alerts','📻','Official Alerts','Can you receive official weather information if power and cellular service fail?','A NOAA radio adds a separate warning channel.','Add and test a NOAA emergency radio.','suburbanRadio','Use more than one way to receive warnings.'),
    q('s_routes','🗺️','Alternate Evacuation Routes','Do you know routes that avoid major commuter and city traffic corridors?','Include school, work, dependent pickup, and regional congestion.','Map two evacuation routes and a reunification point.','suburbanVehicle','The fastest everyday route may be the worst evacuation route.'),
    q('s_neighbors','🤝','Neighborhood Coordination','Have nearby households discussed check-ins or shared constraints during an outage?','Neighbors may identify medical, mobility, child, or pet needs early.','Create a simple neighborhood check-in plan.','suburbanRadio','Prepared neighbors can share information without sharing private details.')
  ],
  'Rural / remote':[
    q('r_radio','📡','Long-Range Alerts','Can you reliably receive official alerts where cellular and broadcast coverage may be weak?','Test reception from the places where the radio will actually be used.','Add and test an emergency radio suited to local coverage.','ruralRadio','Range claims vary with terrain, buildings, and antenna placement.'),
    q('r_satellite','🛰️','Off-Grid Communication','Can you request help or update family when cellular service is unavailable?','Remote travel and long service interruptions may require another communication path.','Establish and practice an off-grid communication method.','ruralSatellite','A satellite device still requires a plan, subscription, charging, and open-sky use.'),
    q('r_filter','🚰','Water Treatment','Can you safely treat a higher volume of water if the usual source is compromised?','Private wells and local sources may be affected by outages, floods, or contamination.','Add an appropriate higher-volume water-treatment method.','ruralFilter','Treatment capability should match the source and official safety guidance.'),
    q('r_water','💧','Stored Water','Do you have stored water if a well pump or private system stops working?','Include drinking, medical, sanitation, animal, and seasonal needs.','Build and rotate a larger-capacity stored-water reserve.','ruralWater','A well is not a backup if the pump cannot operate.'),
    q('r_power','⚡','Essential Backup Power','Can you power essential communication, lighting, and small devices during a long outage?','Rural restoration and outside assistance may take longer.','Identify essential loads and add appropriate backup power.','ruralPower','Prioritize the devices that protect health and communication.'),
    q('r_systems','🔌','Private Home Systems','Does your power plan account for wells, septic, heat, gates, or other private systems?','Document what stops working, safe operating limits, and manual alternatives.','Create a backup plan for every essential private system.','ruralPower','Private infrastructure shifts more responsibility to the household.'),
    q('r_access','🛣️','Blocked Access','Can you leave or receive help if the primary road is blocked?','Consider wildfire, flood, snow, fallen trees, and damaged bridges.','Identify alternate access and early-departure triggers.','ruralSatellite','A communication device is especially useful when physical access is limited.'),
    q('r_medical','🩹','Medical Distance','Is there a plan for urgent care when travel times are long or roads are impaired?','Include medication, first aid, transport backups, and provider contacts.','Document urgent-care routes and medical transport alternatives.','ruralSatellite','Distance makes early decisions and reliable communication more important.'),
    q('r_self_reliance','🏠','Extended Self-Reliance','Could your household safely manage several days of delayed services?','Cover food, water, medication, sanitation, power, heat, communications, and animals.','Extend essential supplies for delayed rural assistance.','ruralWater','Build depth gradually around the systems you depend on every day.')
  ]
};

function questions(){return[locationQuestion,...(PATH_QUESTIONS[answers.setting]||[])];}

let current=0; const answers={}; let latestResult=null;
const $=id=>document.getElementById(id);
const intro=$('quiz-intro'),quiz=$('quiz'),results=$('results');

// Funnel events are recorded once per browser tab so rerenders, back/next
// navigation, and repeated clicks do not inflate Meta reporting.
const metaEventsSent=new Set();
function trackMetaOnce(key,eventName,parameters={},standard=false){
 const storageKey=`mrs:meta:${key}`;
 if(metaEventsSent.has(key))return;
 try{if(sessionStorage.getItem(storageKey))return;}catch(_){ }
 if(typeof window.fbq!=='function')return;
 window.fbq(standard?'track':'trackCustom',eventName,parameters);
 metaEventsSent.add(key);
 try{sessionStorage.setItem(storageKey,'1');}catch(_){ }
}

$('year').textContent=new Date().getFullYear();
initReveal();
$('start-quiz').addEventListener('click',()=>{trackMetaOnce('assessment-started','AssessmentStarted',{assessment_name:'Quick Ready Score',question_count:10});intro.classList.add('hidden');quiz.classList.remove('hidden');renderQuestion(false);scrollToQuizTop('smooth');});
$('exit-quiz').addEventListener('click',()=>{quiz.classList.add('hidden');intro.classList.remove('hidden');document.querySelector('#assessment').scrollIntoView({behavior:'smooth'});});
$('back-button').addEventListener('click',()=>{if(current>0){current--;renderQuestion(true);}});
$('next-button').addEventListener('click',()=>{const qs=questions(),q=qs[current];if(answers[q.id]===undefined)return;if(current<qs.length-1){current++;renderQuestion(true);}else showResults();});

function renderQuestion(shouldScroll=false){
 const qs=questions(),q=qs[current],total=10,pct=Math.round(((current+1)/total)*100);
 $('question-count').textContent=`Question ${current+1} of ${total}`;$('progress-percent').textContent=`${pct}%`;$('progress-bar').style.width=`${pct}%`;
 $('riley-question-prompt').textContent=q.tip;
 $('question-icon').textContent=q.icon;$('question-category').textContent=q.label;$('question-text').textContent=q.question;$('question-help').textContent=q.help;
 $('back-button').style.visibility=current===0?'hidden':'visible';$('next-button').textContent=current===total-1?'See My Ready Score':'Next';
 const box=$('answer-options');box.innerHTML='';
 q.options.forEach(([title,value,detail])=>{const b=document.createElement('button');b.type='button';b.className='answer-option'+(answers[q.id]===value?' selected':'');b.innerHTML=`<span class="option-dot"></span><span><strong>${title}</strong><small>${detail}</small></span>`;b.addEventListener('click',()=>{if(q.id==='setting'&&answers.setting&&answers.setting!==value){Object.keys(answers).filter(key=>key!=='setting').forEach(key=>delete answers[key]);}answers[q.id]=value;try{localStorage.setItem('myReadyScoreSetting',value);}catch(_){ }renderQuestion(false);});box.appendChild(b);});
 $('next-button').disabled=answers[q.id]===undefined;
 if(shouldScroll) scrollToQuizTop('auto');
}

function scrollToQuizTop(behavior='auto'){
 const header=document.querySelector('.site-header');
 const offset=(header?.getBoundingClientRect().height||0)+14;
 // Two animation frames let Safari finish laying out the newly rendered question
 // before we calculate the final page position.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
   const top=quiz.getBoundingClientRect().top+window.pageYOffset-offset;
   window.scrollTo({top:Math.max(0,top),behavior});
 }));
}

function showResults(){
 quiz.classList.add('hidden');results.classList.remove('hidden');
 const scored=questions().filter(q=>q.scored),score=Math.round(scored.reduce((sum,q)=>sum+(answers[q.id]??0),0)/scored.length);
 const weakest=scored.slice().sort((a,b)=>(answers[a.id]??0)-(answers[b.id]??0))[0];
 latestResult={score,weakestCategory:weakest?.label||'',setting:answers.setting,answers:{...answers}};
 trackMetaOnce('assessment-completed','AssessmentCompleted',{assessment_name:'Quick Ready Score',score,household_setting:answers.setting,weakest_category:latestResult.weakestCategory});
 $('score-value').textContent=score;
 let heading,summary;if(score>=85){heading='Strongly Prepared';summary='Your household has many important foundations in place. Focus on testing, maintenance, and the few remaining gaps.';}else if(score>=65){heading='A Solid Start';summary='You have meaningful preparation in place, with several practical opportunities to strengthen your household.';}else if(score>=40){heading='Building Readiness';summary='You have started, but several essential areas would benefit from attention. Prioritize the lowest-scoring categories first.';}else{heading='Start With the Essentials';summary='Your results reveal important opportunities to protect your household. Begin with a few manageable basics rather than trying to do everything at once.';}
 let rileyMessage;
 if(score===100){rileyMessage='100—outstanding work! Your essentials are in strong shape. Review the plan below to keep everything current and tested.';}
 else if(score>=85){rileyMessage=`${score} is an excellent score! I found a few focused recommendations that can help close your remaining gaps.`;}
 else if(score>=65){rileyMessage=`${score} is a great start! See the products I matched to your preparedness gaps to help move your score closer to 100.`;}
 else if(score>=40){rileyMessage=`${score} gives us a clear starting point. I’ve prioritized products for the areas where they can make the biggest difference.`;}
 else{rileyMessage=`${score} is your starting point—and every improvement counts. Begin with the first recommendation and build from there.`;}
 $('score-heading').textContent=heading;$('score-tier').textContent=heading;$('score-summary').textContent=`${answers.setting}: ${summary}`;$('riley-results-message').textContent=rileyMessage;$('result-score-ring').style.setProperty('--result-score',score);
 renderCategories();renderActions();renderRecommendations();results.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderCategories(){const box=$('category-results');box.innerHTML='';questions().filter(q=>q.scored).forEach(q=>{const value=answers[q.id]??0;const row=document.createElement('div');row.className='category-row';row.innerHTML=`<div class="category-top"><span>${q.icon} ${q.label}</span><span>${value}/100</span></div><div class="category-meter"><span style="width:${value}%"></span></div>`;box.appendChild(row);});}
function renderActions(){const list=$('priority-actions');list.innerHTML='';questions().filter(q=>q.scored).sort((a,b)=>(answers[a.id]??0)-(answers[b.id]??0)).slice(0,3).forEach(q=>{const li=document.createElement('li');li.textContent=q.actions;list.appendChild(li);});}
function renderRecommendations(){
 const box=$('recommendations');
 box.innerHTML='';
 const gaps=questions()
   .filter(q=>q.scored)
   .filter(q=>(answers[q.id]??0)<75)
   .sort((a,b)=>(answers[a.id]??0)-(answers[b.id]??0));

 if(!gaps.length){
   box.innerHTML='<div class="all-ready-card"><h3>Your essentials are in strong shape.</h3><p>Review supplies periodically, rotate food and water, test equipment, and practice your household plan.</p></div>';
   return;
 }

 const seenProducts=new Set();
 gaps.forEach((q)=>{
   const p=window.READY_PRODUCTS[q.productKey];
   if(!p)return;
   if(seenProducts.has(q.productKey))return;
   seenProducts.add(q.productKey);
   const index=seenProducts.size-1;
   const card=document.createElement('article');
   const isFeatured=index===0;
   card.className='product-card'+(isFeatured?' featured-product':'');

   const priorityCopy=isFeatured
     ? `<p class="priority-message">Your biggest opportunity to improve is <strong>${q.label.toLowerCase()}</strong>. This is the first product we recommend reviewing.</p>`
     : '';

   card.innerHTML=`
     <div class="product-icon">${p.icon}</div>
     <h3>${p.title}</h3>
     ${priorityCopy}
     <p>${p.description}</p>
     <p class="why"><strong>Why you’re seeing this:</strong> Your ${q.label.toLowerCase()} score was ${answers[q.id]??0}/100.</p>
     <a class="button button-primary" href="${p.link}" target="_blank" rel="nofollow sponsored noopener noreferrer" data-product-id="${q.productKey}" data-product-name="${p.title}" data-product-category="${q.label}" data-product-priority="${index+1}" aria-label="View ${p.title} on Amazon">${isFeatured?'View Recommended Product':'Check Price'}</a>`;
   box.appendChild(card);
 });
}

function initReveal(){const items=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('visible'));return;}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12});items.forEach(el=>observer.observe(el));}


const leadForm=$('lead-form');
if(leadForm){
  leadForm.addEventListener('submit',submitLead);
}

const recommendations=$('recommendations');
if(recommendations){
  recommendations.addEventListener('click',event=>{
    const link=event.target.closest('a[data-product-id]');
    if(!link)return;
    trackMetaOnce(`product-click:${link.dataset.productId}`,'ProductRecommendationClick',{
      content_name:link.dataset.productName,
      content_category:link.dataset.productCategory,
      recommendation_priority:Number(link.dataset.productPriority)
    });
  });
}

async function submitLead(event){
  event.preventDefault();
  const form=event.currentTarget;
  const firstName=$('first-name');
  const email=$('email');
  const message=$('lead-message');
  const submit=$('lead-submit');
  const cleanName=firstName.value.trim();
  const cleanEmail=email.value.trim().toLowerCase();

  message.textContent='';
  message.className='form-message';
  firstName.removeAttribute('aria-invalid');
  email.removeAttribute('aria-invalid');

  if(cleanName.length<1){
    firstName.setAttribute('aria-invalid','true');
    firstName.focus();
    return showLeadMessage('Please enter your first name.','error');
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)){
    email.setAttribute('aria-invalid','true');
    email.focus();
    return showLeadMessage('Please enter a valid email address.','error');
  }

  const params=new URLSearchParams(window.location.search);
  const payload={
    firstName:cleanName,
    email:cleanEmail,
    company:form.elements.company?.value||'',
    quickScore:latestResult?.score??null,
    weakestCategory:latestResult?.weakestCategory||'',
    source:params.get('utm_source')||document.referrer||'direct',
    medium:params.get('utm_medium')||'',
    campaign:params.get('utm_campaign')||'',
    content:params.get('utm_content')||'',
    term:params.get('utm_term')||'',
    landingPage:window.location.href,
    consent:true
  };

  submit.disabled=true;
  submit.setAttribute('aria-busy','true');
  submit.innerHTML='Saving your score…';

  try{
    const response=await fetch('/api/lead',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload)
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error||'We could not save your information.');

    form.classList.add('hidden');
    $('lead-success').classList.remove('hidden');
    try{localStorage.setItem('myReadyScoreLead',JSON.stringify({id:data.id,email:cleanEmail,firstName:cleanName,score:payload.quickScore,setting:latestResult?.setting||''}));}catch(_){ }
    trackMetaOnce('lead','Lead',{content_name:'Comprehensive Assessment Early Access',score:payload.quickScore},true);
    window.dispatchEvent(new CustomEvent('mrs:lead',{detail:{score:payload.quickScore,weakestCategory:payload.weakestCategory}}));
  }catch(error){
    showLeadMessage(error.message||'Something went wrong. Please try again.','error');
    submit.disabled=false;
    submit.removeAttribute('aria-busy');
    submit.innerHTML='Get Comprehensive Assessment Access <span>→</span>';
  }
}

function showLeadMessage(text,type){
  const message=$('lead-message');
  message.textContent=text;
  message.className=`form-message ${type||''}`;
}

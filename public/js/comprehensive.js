const STANDARD_OPTIONS=[
  ['Yes — complete and tested',100,'This is current, accessible, and has been practiced or checked.'],
  ['Mostly in place',70,'The foundation exists, but it needs a small update or test.'],
  ['Partly in place',35,'Some pieces exist, but there is a meaningful gap.'],
  ['Not yet',0,'This is not currently in place.'],
  ['Not sure',20,'This will be marked unverified and will not lower your readiness score.']
];
const YES_NO=[['Yes',100,'This applies to our household.'],['No',100,'This does not apply to our household.']];
const CATEGORIES=[
  ['plan','🧭','Emergency Plan & Communication','How your household coordinates, reconnects, and practices.'],
  ['water','💧','Water','Safe drinking water, storage, treatment, and access.'],
  ['food','🥫','Food & Cooking','Practical meals, dietary needs, rotation, and safe preparation.'],
  ['power','🔋','Power, Light & Warmth','Lighting, charging, temperature safety, and outage planning.'],
  ['medical','🩹','Medical Readiness','First aid, medications, health information, and care continuity.'],
  ['home','🔥','Home & Fire Safety','Prevention, detection, utility controls, and safer sheltering.'],
  ['evac','🚗','Evacuation & Shelter','Routes, destinations, go-bags, transport, and reunification.'],
  ['alerts','📻','Alerts & Local Hazards','Warnings, local risks, trusted information, and backup reception.'],
  ['docs','📄','Documents & Financial Backup','Protected records, insurance, cash, and recovery information.'],
  ['digital','🔐','Digital Resilience','Account recovery, backups, device security, and offline access.'],
  ['children','🧸','Children & Dependents','Age-appropriate plans and continuity for people who rely on you.'],
  ['pets','🐾','Pets & Animals','Identification, supplies, transport, shelter, and care instructions.']
];
const ASSESSMENT_VERSION='1.1.0';
const SCORING_VERSION='2.0.0';
const CONTENT_REVIEW_DATE='2026-11-05';
const UNKNOWN_ANSWER='Not sure';
const SOURCES=[
  {agency:'FEMA / Ready.gov',title:'Are You Ready? An In-Depth Guide to Citizen Preparedness',url:'https://www.ready.gov/sites/default/files/2021-11/are-you-ready-guide.pdf',categories:['plan','water','food','power','evac','docs']},
  {agency:'CDC',title:'Personal Needs — Prepare Your Health',url:'https://www.cdc.gov/prepare-your-health/take-action/personal-needs.html',categories:['water','food','medical','children']},
  {agency:'CDC',title:'Keep Food Safe After a Disaster or Emergency',url:'https://www.cdc.gov/food-safety/foods/keep-food-safe-after-emergency.html',categories:['food','power']},
  {agency:'CDC',title:'Avoiding Carbon Monoxide Poisoning',url:'https://www.cdc.gov/natural-disasters/psa-toolkit/avoiding-carbon-monoxide-poisoning.html',categories:['power','home']},
  {agency:'U.S. Fire Administration',title:'Home Fire Escape Plans',url:'https://www.usfa.fema.gov/prevention/home-fires/prepare-for-fire/home-fire-escape-plans/index.html',categories:['home','evac']},
  {agency:'National Weather Service',title:'NOAA Weather Radio All Hazards',url:'https://www.weather.gov/abr/nwr',categories:['alerts']},
  {agency:'FEMA / Ready.gov',title:'Prepare Your Pets for Disasters',url:'https://www.ready.gov/sites/default/files/2023-06/ready.gov_prepare-pets-for-disasters.pdf',categories:['pets']},
  {agency:'FEMA / Ready.gov',title:'How to Prepare for a Financial Emergency',url:'https://www.ready.gov/sites/default/files/2021-01/ready_financial-emergency_info-sheet.pdf',categories:['docs']},
  {agency:'CISA',title:'Secure Our World — Multifactor Authentication',url:'https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-MFA-Tip-Sheet.pdf',categories:['digital']}
];
function item(category,id,prompt,action,time='month',risk=2,extra={}){
  return {category,id,prompt,action,time,risk,help:extra.help||'Choose the answer that best reflects what your household could rely on today.',tip:extra.tip||'Honest answers create a more useful plan. “Not yet” is a starting point, not a failure.',options:extra.options||STANDARD_OPTIONS,scored:extra.scored!==false,when:extra.when};
}
const QUESTIONS=[
  item('plan','meeting_places','Has your household chosen both a nearby meeting place and an out-of-area meeting place?','Choose and share two household meeting places.','today',3),
  item('plan','out_contact','Does everyone know an out-of-area contact who can relay messages?','Name an out-of-area contact and add them to every phone and wallet card.','today',3),
  item('plan','paper_contacts','Are essential contacts available on paper if phones are unavailable?','Print compact emergency contact cards for each household member.','today',3),
  item('plan','communication_rules','Does your plan explain when to call, text, or leave a message during disruption?','Agree on simple communication rules and write them into the plan.','month',2),
  item('plan','neighbor_network','Have you identified nearby people your household can help or ask for help?','Create a small neighborhood support list with permission.','month',2),
  item('plan','plan_practice','Has the whole household practiced the emergency plan within the past year?','Schedule and complete a short household plan drill.','today',3),

  item('water','water_quantity','Do you have a clearly counted emergency drinking-water supply for everyone?','Store and label an appropriate emergency water supply for the household.','today',3),
  item('water','water_days','Would that supply last at least three days without normal service?','Increase stored water toward at least a three-day baseline.','today',3),
  item('water','water_special','Does your water plan include extra needs for infants, medical use, pets, and hot weather?','Calculate and add water for every special household need.','month',3),
  item('water','water_rotation','Is stored water dated, protected from heat and chemicals, and reviewed on a schedule?','Date stored water and add a recurring review reminder.','month',2),
  item('water','water_treatment','Do you have a reliable method and instructions for treating questionable water?','Add an appropriate water-treatment method and printed directions.','month',3),
  item('water','water_shutoff','Does an adult know how and when to shut off the home water supply?','Locate, label, and practice using the water shutoff safely.','month',2),

  item('food','food_days','Do you have at least three days of shelf-stable food your family will actually eat?','Build a three-day shelf-stable menu from familiar foods.','today',3),
  item('food','food_needs','Does the reserve cover allergies, dietary restrictions, infant needs, and texture needs?','Add foods that cover every household dietary requirement.','today',3),
  item('food','food_rotation','Is emergency food dated, inventoried, and rotated before expiration?','Create a simple food inventory and rotation schedule.','month',2),
  item('food','manual_opener','Is a working manual can opener stored with emergency food?','Store a manual can opener with the food reserve.','today',2),
  item('food','cooking_plan','Can you prepare safe meals during an outage without using unsafe indoor flames?','Choose a safe outage meal and cooking plan; never use outdoor grills indoors.','month',3),
  item('food','fridge_safety','Does your household know when refrigerated or frozen food must be discarded after an outage?','Print food-safety guidance and keep it near the refrigerator.','month',3),

  item('power','flashlights','Are working flashlights or headlamps easy to reach in sleeping and living areas?','Place tested flashlights where they can be found in the dark.','today',3),
  item('power','battery_stock','Do you keep the correct spare batteries charged or in date?','Inventory device batteries and add the missing sizes or chargers.','month',2),
  item('power','phone_power','Can you recharge essential phones for several days without grid power?','Add and test enough backup charging for essential phones.','month',3),
  item('power','temperature_plan','Do you have a safe plan for extreme heat or cold during a long outage?','Identify safe temperature thresholds and a backup location.','today',3),
  item('power','co_safety','Are carbon-monoxide alarms working, especially near sleeping areas and fuel-burning equipment?','Test carbon-monoxide alarms and replace missing or expired units.','today',3),
  item('power','generator_safety','If a generator may be used, are placement, fuel, connection, and operating rules understood?','Write and practice a generator safety checklist before an outage.','month',3,{help:'If you do not own a generator, choose “Yes” only if your plan clearly rules one out and covers power another way.'}),

  item('medical','first_aid','Is a well-stocked first aid kit accessible and checked for expired or used items?','Restock and date-check the household first aid kit.','today',3),
  item('medical','first_aid_skills','Has at least one household member completed current first aid or CPR training?','Enroll an adult or capable teen in first aid and CPR training.','month',3),
  item('medical','med_supply','Do essential prescriptions have a refill and continuity plan for disruptions?','Ask the prescriber or pharmacist about a safe medication continuity plan.','today',3),
  item('medical','med_list','Is a current medication, allergy, provider, and insurance list available offline?','Create and protect an offline household medical summary.','today',3),
  item('medical','device_gate','Does anyone rely on powered medical or accessibility equipment?','Document whether powered medical equipment applies.','today',1,{options:YES_NO,scored:false,tip:'This answer only personalizes follow-up questions; it does not change your score.'}),
  item('medical','device_backup','Is there a tested backup-power and supplier plan for essential medical equipment?','Create and test a backup plan for essential medical equipment.','today',3,{when:a=>a.device_gate==='Yes'}),

  item('home','smoke_alarms','Are smoke alarms installed in the right locations and tested regularly?','Test every smoke alarm and replace missing or expired units.','today',3),
  item('home','extinguishers','Are suitable fire extinguishers accessible, current, and understood by adults?','Place and review appropriate fire extinguishers with capable adults.','month',3),
  item('home','two_exits','Can everyone identify two ways out of sleeping and living areas?','Walk through two exit routes from each occupied area.','today',3),
  item('home','utility_controls','Do capable adults know the location and safe operation of utility shutoffs?','Label utility controls and learn when professional guidance is required.','month',3),
  item('home','heavy_items','Are tall furniture, heavy objects, and hazardous materials secured appropriately?','Secure the highest-risk furniture and stored hazards.','month',2),
  item('home','safe_room','Have you identified the safest place in the home for local severe-weather hazards?','Choose and clear the safest shelter location for local hazards.','today',3),

  item('evac','routes','Do you know at least two ways to leave your neighborhood?','Map two evacuation routes and keep a paper copy.','today',3),
  item('evac','destinations','Have you selected nearby and distant places where your household could stay?','Confirm two evacuation destinations and how to reach them.','month',3),
  item('evac','go_bags','Does each person have access to a practical, seasonally appropriate go-bag?','Build or update go-bags for each household member.','month',2),
  item('evac','transport','Is there a transport plan if the usual vehicle, fuel, or driver is unavailable?','Create a backup evacuation transportation plan.','month',3),
  item('evac','vehicle_readiness','Is the primary vehicle maintained, fueled, and stocked with basic emergency supplies?','Set a minimum fuel level and add a compact vehicle kit.','month',2),
  item('evac','reunification','Does everyone know what to do if evacuation happens while the household is separated?','Write a reunification plan for work, school, and caregiving locations.','today',3),

  item('alerts','local_hazards','Can your household name the most likely local natural and infrastructure hazards?','List the top local hazards and the protective action for each.','month',2),
  item('alerts','warning_signups','Are you enrolled in official local emergency alert systems?','Enroll household phones in official local alert services.','today',3),
  item('alerts','weather_radio','Can you receive warnings if cellular data and household power fail?','Add and test a battery or hand-crank alert radio.','month',3),
  item('alerts','trusted_sources','Have you identified trusted official information sources and avoided relying on social rumors?','Bookmark official local emergency, weather, and utility sources.','today',2),
  item('alerts','alert_actions','Does everyone understand common alert terms and what action each requires?','Review local warning terms and protective actions together.','month',3),
  item('alerts','language_access','Are warnings accessible in the languages and formats everyone needs?','Configure language, hearing, vision, or accessibility alert support.','month',3),

  item('docs','id_copies','Are protected copies of identification and vital records available away from the originals?','Create protected physical or encrypted copies of vital records.','month',3),
  item('docs','insurance_records','Are policy numbers, coverage contacts, and a home inventory current and accessible?','Update insurance contacts and begin a photo home inventory.','month',3),
  item('docs','emergency_cash','Do you keep a modest amount of safely stored cash in useful denominations?','Set aside a modest emergency cash reserve within your means.','month',2),
  item('docs','account_access','Could a trusted adult locate essential financial obligations and accounts if needed?','Create protected instructions for essential household financial access.','month',2),
  item('docs','document_grab','Could you quickly take or access critical records during evacuation?','Create a protected evacuation-ready document packet.','today',3),
  item('docs','recovery_contacts','Are recovery contacts for insurance, utilities, banks, landlord or mortgage available offline?','Print a concise post-disaster recovery contact list.','month',2),

  item('digital','password_manager','Does the household use strong unique passwords and a reputable password manager?','Move critical accounts to unique passwords in a password manager.','month',3),
  item('digital','mfa','Is multi-factor authentication enabled on email, financial, cloud, and carrier accounts?','Enable strong multi-factor authentication on the most critical accounts.','today',3),
  item('digital','recovery_codes','Are account recovery codes stored securely somewhere accessible offline?','Generate and protect offline recovery codes for critical accounts.','month',3),
  item('digital','device_backup','Are important photos, records, and device data backed up and recoverable?','Configure and test a backup for important household data.','month',2),
  item('digital','offline_info','Are maps, contacts, tickets, and key instructions available without internet access?','Download or print essential information for offline use.','today',2),
  item('digital','family_access','Could a trusted person access essential digital information if the account owner were unavailable?','Create a secure digital continuity plan for a trusted person.','later',2),

  item('children','children_gate','Are children or other dependents regularly part of this household?','Document whether dependent planning applies.','today',1,{options:YES_NO,scored:false,tip:'This answer personalizes the assessment and never lowers your score.'}),
  item('children','child_contacts','Do dependents know or carry names, phone numbers, and reunification instructions appropriate to their age?','Create age-appropriate contact and reunification cards.','today',3,{when:a=>a.children_gate==='Yes'}),
  item('children','school_plan','Do you know school, daycare, or program emergency and authorized-pickup procedures?','Review and update every dependent-care emergency procedure.','month',3,{when:a=>a.children_gate==='Yes'}),
  item('children','comfort_items','Are comfort, feeding, hygiene, and age-specific supplies included in kits?','Add age-specific comfort and daily-care supplies to household kits.','month',2,{when:a=>a.children_gate==='Yes'}),
  item('children','caregiver_plan','Could a backup caregiver follow essential routines, medications, and safety instructions?','Write a concise emergency caregiver guide.','month',3,{when:a=>a.children_gate==='Yes'}),
  item('children','dependent_practice','Have dependents practiced the plan in a calm, age-appropriate way?','Practice one calm, age-appropriate preparedness routine.','month',2,{when:a=>a.children_gate==='Yes'}),

  item('pets','pets_gate','Are pets or other animals part of this household?','Document whether animal planning applies.','today',1,{options:YES_NO,scored:false,tip:'This answer personalizes the assessment and never lowers your score.'}),
  item('pets','pet_id','Do animals have current identification, registration, and recent photos?','Update animal identification and save recent photos.','today',3,{when:a=>a.pets_gate==='Yes'}),
  item('pets','pet_supplies','Is there a portable supply of food, water, medication, sanitation items, and comfort items?','Build a portable emergency supply kit for each animal.','month',3,{when:a=>a.pets_gate==='Yes'}),
  item('pets','pet_transport','Are carriers, leashes, or transport equipment accessible and correctly sized?','Prepare and practice safe animal transport.','month',3,{when:a=>a.pets_gate==='Yes'}),
  item('pets','pet_shelter','Have you identified evacuation destinations that accept or safely accommodate animals?','Confirm two animal-friendly evacuation destinations.','month',3,{when:a=>a.pets_gate==='Yes'}),
  item('pets','pet_caregiver','Could a backup caregiver access animals and follow written care instructions?','Arrange a backup animal caregiver and share written instructions.','later',2,{when:a=>a.pets_gate==='Yes'})
];

const STORAGE_KEY='mrs:comprehensive:v1';
const state={answers:{},index:0,started:false,assessmentVersion:ASSESSMENT_VERSION,scoringVersion:SCORING_VERSION};
const $=id=>document.getElementById(id);
let lead=null;
try{lead=JSON.parse(localStorage.getItem('myReadyScoreLead')||'null');Object.assign(state,JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'));}catch(_){ }
if(lead?.firstName)$('welcome-name').textContent=`Welcome, ${lead.firstName}.`;
const categoryMap=Object.fromEntries(CATEGORIES.map(c=>[c[0],c]));

function applicable(){return QUESTIONS.filter(q=>!q.when||q.when(state.answers));}
function answeredQuestions(){return applicable().filter(q=>state.answers[q.id]!==undefined);}
function save(){state.assessmentVersion=ASSESSMENT_VERSION;state.scoringVersion=SCORING_VERSION;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$('save-status').textContent='Saved just now';setTimeout(()=>$('save-status').textContent='Saved on this device',1400);}catch(_){$('save-status').textContent='Unable to save';}}
function scoreOption(q,value){return q.options.find(o=>o[0]===value)?.[1]??0;}
function scoreFor(q){return scoreOption(q,state.answers[q.id]);}
function scoredQuestions(code){return applicable().filter(q=>q.scored&&(!code||q.category===code));}
function knownQuestions(code){return scoredQuestions(code).filter(q=>state.answers[q.id]!==UNKNOWN_ANSWER);}
function categoryScore(code){const qs=knownQuestions(code);if(!qs.length)return null;return Math.round(qs.reduce((s,q)=>s+scoreFor(q),0)/qs.length);}
function overallScore(){const scores=CATEGORIES.map(c=>categoryScore(c[0])).filter(Number.isFinite);return scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null;}
function confidence(code){const all=scoredQuestions(code);return all.length?Math.round((knownQuestions(code).length/all.length)*100):null;}
function progress(){const qs=applicable();return Math.round((answeredQuestions().length/qs.length)*100);}

function renderRail(){
  const p=progress();$('overall-bar').style.width=`${p}%`;$('overall-progress').textContent=`${p}% complete`;
  const current=applicable()[state.index];
  $('category-nav').innerHTML=CATEGORIES.map(([code,icon,label])=>{const qs=applicable().filter(q=>q.category===code);const done=qs.length&&qs.every(q=>state.answers[q.id]!==undefined);return `<span class="category-nav-item ${current?.category===code?'active':''} ${done?'done':''}"><b>${done?'✓':icon}</b>${label}</span>`;}).join('');
}
function renderQuestion(){
  const qs=applicable();if(state.index>=qs.length)state.index=qs.length-1;
  const q=qs[state.index],cat=categoryMap[q.category];
  $('deep-category').textContent=`${cat[1]} ${cat[2]}`;$('deep-count').textContent=`Question ${state.index+1} of ${qs.length}`;$('deep-tip').textContent=q.tip;
  $('deep-question-card').innerHTML=`<h1>${q.prompt}</h1><p>${q.help}</p><div class="deep-options">${q.options.map(o=>`<button class="deep-option ${state.answers[q.id]===o[0]?'selected':''}" type="button" data-answer="${o[0].replace(/"/g,'&quot;')}"><i></i><span><strong>${o[0]}</strong><small>${o[2]}</small></span></button>`).join('')}</div>`;
  $('deep-question-card').querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{state.answers[q.id]=button.dataset.answer;save();renderQuestion();}));
  $('deep-back').disabled=state.index===0;$('deep-next').disabled=state.answers[q.id]===undefined;$('deep-next').innerHTML=state.index===qs.length-1?'Build My Roadmap <span>→</span>':'Next <span>→</span>';renderRail();window.scrollTo({top:0,behavior:'smooth'});
}
function start(){state.started=true;save();$('deep-intro').classList.add('hidden');$('deep-results').classList.add('hidden');$('deep-assessment').classList.remove('hidden');renderQuestion();}
$('begin-deep').addEventListener('click',start);
$('deep-back').addEventListener('click',()=>{if(state.index>0){state.index--;save();renderQuestion();}});
$('deep-next').addEventListener('click',()=>{const qs=applicable();if(state.answers[qs[state.index].id]===undefined)return;if(state.index<qs.length-1){state.index++;save();renderQuestion();}else showReport();});
$('save-exit').addEventListener('click',()=>{save();$('deep-assessment').classList.add('hidden');$('deep-intro').classList.remove('hidden');$('begin-deep').innerHTML='Resume My Assessment <span>→</span>';});
$('print-report').addEventListener('click',()=>window.print());
$('retake-deep').addEventListener('click',()=>{if(!confirm('Clear your comprehensive answers and start again?'))return;state.answers={};state.index=0;state.started=true;save();start();});

function tier(score){if(!Number.isFinite(score))return['Verification needed','There is not enough confirmed information to calculate a meaningful readiness score. Start with the verification items below.'];if(score>=85)return['Strongly prepared','Your household has strong systems in place. Keep testing them and close the few remaining gaps.'];if(score>=65)return['Solid foundation','You have meaningful readiness in place. A focused set of improvements will make the plan more dependable.'];if(score>=40)return['Building readiness','Your answers reveal a useful starting point and several high-impact opportunities.'];return['Start with the essentials','Focus first on the safety-critical actions in this report. A few practical steps can materially improve readiness.'];}
function showReport(){
  state.completedAt=new Date().toISOString();save();$('deep-assessment').classList.add('hidden');$('deep-intro').classList.add('hidden');$('deep-results').classList.remove('hidden');
  const score=overallScore(),reportConfidence=confidence(),[label,summary]=tier(score);$('deep-score').textContent=score??'—';$('deep-tier').textContent=label;$('report-summary').textContent=summary;$('report-title').textContent=lead?.firstName?`${lead.firstName}’s household roadmap`:'Your household roadmap';$('report-confidence').textContent=`Answer confidence: ${reportConfidence}% verified`;$('report-version').textContent=`Assessment ${ASSESSMENT_VERSION} · Scoring ${SCORING_VERSION}`;$('report-date').textContent=`Prepared ${new Intl.DateTimeFormat(undefined,{dateStyle:'long'}).format(new Date())} · Guidance reviewed ${new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(new Date(`${CONTENT_REVIEW_DATE}T12:00:00`))}`;
  $('deep-category-results').innerHTML=CATEGORIES.map(([code,icon,name,desc])=>{const value=categoryScore(code),certainty=confidence(code);return `<article class="deep-category-card"><div class="deep-category-top"><span>${icon} ${name}</span><strong>${value??'Verify'}</strong></div><p>${desc}</p><div class="category-confidence">${certainty===null?'Not applicable':`${certainty}% verified`}</div><div class="deep-category-meter"><span style="width:${value??0}%"></span></div></article>`;}).join('');
  const unknowns=applicable().filter(q=>q.scored&&state.answers[q.id]===UNKNOWN_ANSWER).sort((a,b)=>b.risk-a.risk);
  const gaps=applicable().filter(q=>q.scored&&state.answers[q.id]!==UNKNOWN_ANSWER&&scoreFor(q)<70).map(q=>({...q,score:scoreFor(q),priority:(100-scoreFor(q))*q.risk})).sort((a,b)=>b.priority-a.priority);
  const groups=[['verify','Verify first','These answers are unknown. Check them before relying on the related system.'],['today','Fix first','Safety-critical or quick actions to begin now.'],['month','Build this month','Important systems to complete over the next few weeks.'],['later','Strengthen next','Useful resilience improvements after the essentials.']];
  $('roadmap-groups').innerHTML=groups.map(([key,title,description])=>{const rows=(key==='verify'?unknowns:gaps.filter(g=>g.time===key)).slice(0,key==='today'?8:10);if(!rows.length)return'';return `<div class="roadmap-group"><h3>${title}</h3><p>${description}</p><div class="roadmap-list">${rows.map(g=>`<article class="roadmap-item ${key==='verify'?'verify-item':''}"><span>${categoryMap[g.category][1]} ${categoryMap[g.category][2]} · ${key==='verify'?'Unverified':`Current ${g.score}/100`}</span><h4>${key==='verify'?`Verify: ${g.prompt}`:g.action}</h4><p>${key==='verify'?'Confirm what is currently in place, then update this assessment.':g.prompt}</p></article>`).join('')}</div></div>`;}).join('');
  const wins=applicable().filter(q=>q.scored&&state.answers[q.id]!==UNKNOWN_ANSWER&&scoreFor(q)>=70).sort((a,b)=>scoreFor(b)-scoreFor(a)).slice(0,6);
  $('readiness-wins').innerHTML=wins.length?wins.map(w=>`<article class="win-card"><strong>✓ ${categoryMap[w.category][2]}</strong><span>${w.prompt}</span></article>`).join(''):'<p>Completing the first few roadmap actions will create your first readiness wins.</p>';
  $('evidence-sources').innerHTML=SOURCES.map(source=>`<a class="evidence-card" href="${source.url}" target="_blank" rel="noopener noreferrer"><span>${source.agency}</span><strong>${source.title}</strong><small>Covers: ${source.categories.map(code=>categoryMap[code][2]).join(', ')}</small></a>`).join('');
  window.scrollTo({top:0,behavior:'smooth'});
}

if(state.completedAt&&applicable().every(q=>state.answers[q.id]!==undefined))showReport();
else if(state.started&&answeredQuestions().length){$('begin-deep').innerHTML='Resume My Assessment <span>→</span>';}

const questions = [
  {id:'water',icon:'💧',label:'Emergency Water',question:'Does your household have a reliable emergency water supply or storage plan?',help:'A common planning target is enough water for each person for several days.',actions:'Create a household emergency water storage plan.',options:[['Yes, fully prepared',100,'We have stored water and a clear replenishment plan.'],['Partially',55,'We have some water, but not enough or no formal plan.'],['Not yet',0,'We do not currently have emergency water set aside.']]},
  {id:'documents',icon:'📄',label:'Important Documents',question:'Are copies of your essential documents protected and easy to access?',help:'Think identification, insurance, medical, financial, and property records.',actions:'Protect copies of essential household documents.',options:[['Yes, protected and organized',100,'They are stored securely and accessible when needed.'],['Some are protected',55,'We have copies, but they are incomplete or not fully protected.'],['No',0,'We do not have a secure document system.']]},
  {id:'weather',icon:'📻',label:'Weather Alerts',question:'Can your family receive emergency weather information if power or cellular service fails?',help:'A battery, hand-crank, or solar NOAA radio can provide a separate alert channel.',actions:'Add an independent way to receive emergency alerts.',options:[['Yes',100,'We have a working backup alert method.'],['Possibly',50,'We rely mostly on phones or have untested equipment.'],['No',0,'We have no backup method for weather alerts.']]},
  {id:'firstAid',icon:'🩹',label:'First Aid',question:'Do you have a complete, accessible first aid kit that household members know how to find?',help:'Check expiration dates and replace used supplies periodically.',actions:'Stock and review a complete first aid kit.',options:[['Yes, complete and checked',100,'Our kit is stocked, current, and easy to locate.'],['Basic kit only',55,'We have some supplies but may be missing important items.'],['No kit',0,'We do not have a dedicated first aid kit.']]},
  {id:'contacts',icon:'🪪',label:'Emergency Information',question:'Does each family member carry or know how to access emergency contacts and medical details?',help:'This is especially useful for children, older adults, caregivers, allergies, and medications.',actions:'Create portable emergency contact and medical cards.',options:[['Yes',100,'The information is current and accessible.'],['For some family members',50,'Coverage is incomplete or information may be outdated.'],['No',0,'We do not have portable emergency information.']]},
  {id:'tools',icon:'🛠️',label:'Basic Tools',question:'Do you keep a dependable multipurpose tool with your emergency supplies?',help:'A compact multitool can help with basic repairs, opening packages, and utility tasks.',actions:'Add a dependable multipurpose tool to your kit.',options:[['Yes',100,'We have a dependable tool and know where it is.'],['Maybe',50,'We have scattered tools but no dedicated emergency option.'],['No',0,'We do not have one in our emergency supplies.']]},
  {id:'communications',icon:'📡',label:'Backup Communication',question:'Does your household have a backup communication method beyond normal cell service?',help:'Radios can help household members communicate locally when networks are overloaded or unavailable.',actions:'Plan a backup family communication method.',options:[['Yes, and we have practiced',100,'We have equipment, a plan, and basic familiarity.'],['Equipment but no practice',60,'We own radios or similar equipment but have not tested the plan.'],['No',0,'We rely entirely on normal cellular service.']]},
  {id:'power',icon:'🔋',label:'Backup Power',question:'Can you recharge phones, lights, or essential small devices during a prolonged outage?',help:'Consider capacity, safe charging, and how the backup itself will be recharged.',actions:'Set up backup power for essential devices.',options:[['Yes, for multiple days',100,'We have tested backup power and a recharging plan.'],['Limited backup',50,'We have small battery packs or only short-term capacity.'],['No',0,'We have no meaningful backup power.']]},
  {id:'food',icon:'🥫',label:'Emergency Food',question:'Do you have several days of shelf-stable food that fits your household’s dietary needs?',help:'Include a manual can opener, water needs, medications, infant needs, and pet food where applicable.',actions:'Build a practical shelf-stable emergency food reserve.',options:[['Yes, rotated and organized',100,'We have enough and regularly check dates.'],['Some food',55,'We have food, but not enough or not organized.'],['No reserve',0,'We do not keep a dedicated emergency food supply.']]}
];

let current=0; const answers={}; let latestResult=null;
const $=id=>document.getElementById(id);
const intro=$('quiz-intro'),quiz=$('quiz'),results=$('results');
$('year').textContent=new Date().getFullYear();
initReveal();
$('start-quiz').addEventListener('click',()=>{intro.classList.add('hidden');quiz.classList.remove('hidden');renderQuestion(false);scrollToQuizTop('smooth');});
$('exit-quiz').addEventListener('click',()=>{quiz.classList.add('hidden');intro.classList.remove('hidden');document.querySelector('#assessment').scrollIntoView({behavior:'smooth'});});
$('back-button').addEventListener('click',()=>{if(current>0){current--;renderQuestion(true);}});
$('next-button').addEventListener('click',()=>{if(answers[questions[current].id]===undefined)return;if(current<questions.length-1){current++;renderQuestion(true);}else showResults();});

function renderQuestion(shouldScroll=false){
 const q=questions[current],pct=Math.round(((current+1)/questions.length)*100);
 $('question-count').textContent=`Question ${current+1} of ${questions.length}`;$('progress-percent').textContent=`${pct}%`;$('progress-bar').style.width=`${pct}%`;
 $('question-icon').textContent=q.icon;$('question-category').textContent=q.label;$('question-text').textContent=q.question;$('question-help').textContent=q.help;
 $('back-button').style.visibility=current===0?'hidden':'visible';$('next-button').textContent=current===questions.length-1?'See My Ready Score':'Next';
 const box=$('answer-options');box.innerHTML='';
 q.options.forEach(([title,value,detail])=>{const b=document.createElement('button');b.type='button';b.className='answer-option'+(answers[q.id]===value?' selected':'');b.innerHTML=`<span class="option-dot"></span><span><strong>${title}</strong><small>${detail}</small></span>`;b.addEventListener('click',()=>{answers[q.id]=value;renderQuestion(false);});box.appendChild(b);});
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
 const score=Math.round(questions.reduce((sum,q)=>sum+(answers[q.id]??0),0)/questions.length);
 const weakest=questions.slice().sort((a,b)=>(answers[a.id]??0)-(answers[b.id]??0))[0];
 latestResult={score,weakestCategory:weakest?.label||'',answers:{...answers}};
 $('score-value').textContent=score;
 let heading,summary;if(score>=85){heading='Strongly Prepared';summary='Your household has many important foundations in place. Focus on testing, maintenance, and the few remaining gaps.';}else if(score>=65){heading='A Solid Start';summary='You have meaningful preparation in place, with several practical opportunities to strengthen your household.';}else if(score>=40){heading='Building Readiness';summary='You have started, but several essential areas would benefit from attention. Prioritize the lowest-scoring categories first.';}else{heading='Start With the Essentials';summary='Your results reveal important opportunities to protect your household. Begin with a few manageable basics rather than trying to do everything at once.';}
 $('score-heading').textContent=heading;$('score-tier').textContent=heading;$('score-summary').textContent=summary;$('result-score-ring').style.setProperty('--result-score',score);
 renderCategories();renderActions();renderRecommendations();results.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderCategories(){const box=$('category-results');box.innerHTML='';questions.forEach(q=>{const value=answers[q.id]??0;const row=document.createElement('div');row.className='category-row';row.innerHTML=`<div class="category-top"><span>${q.icon} ${q.label}</span><span>${value}/100</span></div><div class="category-meter"><span style="width:${value}%"></span></div>`;box.appendChild(row);});}
function renderActions(){const list=$('priority-actions');list.innerHTML='';questions.slice().sort((a,b)=>(answers[a.id]??0)-(answers[b.id]??0)).slice(0,3).forEach(q=>{const li=document.createElement('li');li.textContent=q.actions;list.appendChild(li);});}
function renderRecommendations(){
 const box=$('recommendations');
 box.innerHTML='';
 const gaps=questions
   .filter(q=>(answers[q.id]??0)<75)
   .sort((a,b)=>(answers[a.id]??0)-(answers[b.id]??0));

 if(!gaps.length){
   box.innerHTML='<div class="all-ready-card"><h3>Your essentials are in strong shape.</h3><p>Review supplies periodically, rotate food and water, test equipment, and practice your household plan.</p></div>';
   return;
 }

 gaps.forEach((q,index)=>{
   const p=window.READY_PRODUCTS[q.id];
   if(!p)return;
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
     <a class="button button-primary" href="${p.link}" target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="View ${p.title} on Amazon">${isFeatured?'View Recommended Product':'Check Price'}</a>`;
   box.appendChild(card);
 });
}

function initReveal(){const items=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('visible'));return;}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12});items.forEach(el=>observer.observe(el));}


const leadForm=$('lead-form');
if(leadForm){
  leadForm.addEventListener('submit',submitLead);
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
    try{localStorage.setItem('myReadyScoreLead',JSON.stringify({id:data.id,email:cleanEmail,score:payload.quickScore}));}catch(_){ }
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

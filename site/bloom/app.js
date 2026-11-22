/* Bloom Club — offline-first personal wellness tracker. No analytics, accounts or remote APIs. */
(function(){
'use strict';
var STORE='bloom_club_v1';
var weekNames=['Ned','Pon','Uto','Sre','Čet','Pet','Sub'];
var months=['januar','februar','mart','april','maj','jun','jul','avgust','septembar','oktobar','novembar','decembar'];
var quotes=[
'Ne moraš savršeno. Samo nežno, ali dosledno.',
'Postaješ devojka koja ispunjava obećanja sebi.',
'Mali koraci svakog dana menjaju celu priču.',
'Tvoje telo zaslužuje brigu, ne kaznu.',
'Budi ponosna na trud koji niko ne vidi.',
'Najlepši glow-up počinje brigom o sebi.',
'Napredak nije prava linija. I dalje je napredak.',
'Izaberi ono zbog čega ćeš sutra biti zahvalna sebi.',
'Disciplinu gradiš ljubavlju prema sebi.',
'Biti jaka i biti nežna mogu zajedno.',
'Ponekad je odmor najbolji deo plana.',
'Danas uradi jednu malu stvar za sebe.'
];
var habits=[{id:'fresh',icon:'🥗',name:'Nešto hranljivo',sub:'Obrok koji ti prija'},{id:'outside',icon:'☀️',name:'Malo svežeg vazduha',sub:'Kratka šetnja se računa'},{id:'journal',icon:'📓',name:'Trenutak za sebe',sub:'Bez telefona, makar 5 minuta'}];
var foods=[
[{name:'Kačamak + grčki jogurt',kcal:360,protein:17,icon:'🥣'},{name:'Piletina, pirinač i salata',kcal:570,protein:42,icon:'🍚'},{name:'Omlet sa povrćem i tost',kcal:430,protein:27,icon:'🍳'},{name:'Jabuka i šaka badema',kcal:220,protein:5,icon:'🍎'}],
[{name:'Jaja + integralni hleb',kcal:400,protein:24,icon:'🍳'},{name:'Tuna salata sa krompirom',kcal:520,protein:33,icon:'🥗'},{name:'Ćureći sendvič i povrće',kcal:480,protein:30,icon:'🥪'},{name:'Jogurt i banana',kcal:230,protein:9,icon:'🍌'}],
[{name:'Ovsena kaša sa voćem',kcal:410,protein:17,icon:'🥣'},{name:'Ćuretina i kus-kus',kcal:580,protein:39,icon:'🍲'},{name:'Povrće, pasulj i feta',kcal:500,protein:22,icon:'🥗'},{name:'Kruška i orasi',kcal:240,protein:4,icon:'🍐'}],
[{name:'Grčki jogurt, voće i granola',kcal:390,protein:21,icon:'🍓'},{name:'Piletina sa pečenim krompirom',kcal:610,protein:44,icon:'🍗'},{name:'Tortilja sa tunjevinom',kcal:480,protein:30,icon:'🌯'},{name:'Kiselo mleko i voće',kcal:180,protein:8,icon:'🫐'}],
[{name:'Tost, sir i paradajz',kcal:390,protein:20,icon:'🥪'},{name:'Rižoto sa pečurkama i piletinom',kcal:590,protein:35,icon:'🍚'},{name:'Salata sa jajima i leblebijama',kcal:490,protein:24,icon:'🥗'},{name:'Jogurt i mandarina',kcal:170,protein:8,icon:'🍊'}],
[{name:'Palačinke sa jogurtom i voćem',kcal:430,protein:19,icon:'🥞'},{name:'Pasta sa tunjevinom',kcal:610,protein:36,icon:'🍝'},{name:'Pileća supa i sendvič',kcal:480,protein:32,icon:'🍲'},{name:'Banana i kikiriki puter',kcal:240,protein:6,icon:'🍌'}],
[{name:'Kajgana i paradajz',kcal:380,protein:24,icon:'🍳'},{name:'Pečeno meso, krompir i povrće',kcal:630,protein:40,icon:'🍽️'},{name:'Salata sa mocarelom i hlebom',kcal:500,protein:23,icon:'🥗'},{name:'Voće i kefir',kcal:200,protein:9,icon:'🍓'}]
];
var mealNames=['Doručak','Ručak','Večera','Užina'];
var programs={
 balanced:{name:'Strong & Balanced',tag:'Teretana ili kuća',workouts:[
 {title:'Donji deo & gluteus',type:'Snaga',minutes:45,icon:'🍑',items:[['Čučanj',3,'10–12'],['Rumunsko mrtvo dizanje',3,'10'],['Iskorak',3,'10 / noga'],['Glute bridge',3,'15'],['Plank',3,'30–40 s']]},
 {title:'Gornji deo & core',type:'Snaga',minutes:40,icon:'💪',items:[['Veslanje bučicama / gumom',3,'12'],['Potisak za ramena',3,'10'],['Sklek sa osloncem',3,'8–12'],['Biceps pregib',3,'12'],['Dead bug',3,'12']]},
 {title:'Full body & kondicija',type:'Full body',minutes:45,icon:'✨',items:[['Goblet čučanj',3,'12'],['Hip thrust',3,'12'],['Lat povlačenje / guma',3,'12'],['Step-up',3,'10 / noga'],['Brza šetnja',1,'10 min']]}
 ]},
 home:{name:'Pilates & At Home',tag:'Bez teretane',workouts:[
 {title:'Pilates legs & glutes',type:'Pilates',minutes:30,icon:'🩰',items:[['Čučanj',3,'15'],['Glute bridge',3,'20'],['Donkey kicks',3,'15 / noga'],['Side leg raises',3,'15 / strana'],['Istezanje',1,'5 min']]},
 {title:'Pilates core & posture',type:'Pilates',minutes:25,icon:'🌷',items:[['Bird dog',3,'12'],['Dead bug',3,'12'],['Plank na kolenima',3,'30 s'],['Superman',3,'12'],['Istezanje leđa',1,'5 min']]},
 {title:'Low impact full body',type:'Pilates',minutes:35,icon:'🧘‍♀️',items:[['Iskorak unazad',3,'10 / noga'],['Wall push-ups',3,'12'],['Glute bridge hold',3,'30 s'],['Side plank',2,'20 s / strana'],['Šetnja',1,'15 min']]}
 ]},
 gym:{name:'Strong Girl Gym',tag:'Teretana',workouts:[
 {title:'Glutes & legs',type:'Snaga',minutes:55,icon:'🍑',items:[['Hip thrust',4,'8–10'],['Rumunsko mrtvo dizanje',3,'10'],['Leg press',3,'12'],['Abdukcija',3,'15'],['Listovi',3,'15']]},
 {title:'Upper body & posture',type:'Snaga',minutes:50,icon:'💪',items:[['Lat pulldown',3,'10'],['Seated row',3,'12'],['Dumbbell shoulder press',3,'10'],['Lateral raises',3,'15'],['Cable triceps',3,'12']]},
 {title:'Legs & full body',type:'Snaga',minutes:55,icon:'✨',items:[['Goblet / barbell squat',4,'8–10'],['Bulgarian split squat',3,'10 / noga'],['Leg curl',3,'12'],['Chest press',3,'10'],['Core: plank',3,'40 s']]}
 ]}
};
var scheduleMap={2:[2,5],3:[1,3,5],4:[1,2,4,6],5:[1,2,3,5,6],6:[1,2,3,4,5,6]};
function localDate(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function parseDate(s){var p=String(s).split('-').map(Number);return new Date(p[0],p[1]-1,p[2],12);}
function addDays(s,n){var d=parseDate(s);d.setDate(d.getDate()+n);return localDate(d);}
function dateTitle(s){var d=parseDate(s);return d.getDate()+'. '+months[d.getMonth()]+' '+d.getFullYear()+'.';}
function dateShort(s){var d=parseDate(s);return d.getDate()+'.'+(d.getMonth()+1)+'.';}
function safe(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function num(v,min,max,fallback){var x=Number(v);return Number.isFinite(x)?Math.min(max,Math.max(min,x)):fallback;}
function defaults(){return {version:1,name:'',goal:'energija',level:'pocetni',program:'balanced',days:3,waterTarget:2000,stepsTarget:8000,calorieTarget:null,proteinTarget:null,entries:{},created:localDate()};}
var state;
try{state=Object.assign(defaults(),JSON.parse(localStorage.getItem(STORE)||'{}'));if(!state.entries||typeof state.entries!=='object')state.entries={};}catch(e){state=defaults();}
var ui={tab:'home',date:localDate(),month:localDate().slice(0,7),foodMode:'today',workoutMode:'plan',progressMode:'week'};
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){toast('Memorija pregledača je puna. Izvezi backup.');}}
function entry(date){var k=date||ui.date;if(!state.entries[k])state.entries[k]={water:0,steps:0,sleep:null,mood:null,energy:null,meals:[],workout:null,minutes:0,completedEx:[],habits:{},weight:null,waist:null,note:''};return state.entries[k];}
function readEntry(k){return state.entries[k]||{water:0,steps:0,sleep:null,mood:null,energy:null,meals:[],workout:null,minutes:0,completedEx:[],habits:{},weight:null,waist:null,note:''};}
function mealPlan(date){var day=(parseDate(date).getDay()+6)%7;return foods[day];}
function workoutFor(date){var dow=parseDate(date).getDay();var sched=scheduleMap[Number(state.days)]||scheduleMap[3];var ix=sched.indexOf(dow);if(ix===-1)return null;var selected=programs[state.program]||programs.balanced;return Object.assign({id:state.program+'_'+ix},selected.workouts[ix%selected.workouts.length]);}
function round(n){return Math.round(Number(n)||0);}
function kcal(date){return (readEntry(date).meals||[]).reduce(function(s,m){return s+Number(m.kcal||0);},0);}
function protein(date){return (readEntry(date).meals||[]).reduce(function(s,m){return s+Number(m.protein||0);},0);}
function percent(a,b){return b>0?Math.min(100,Math.round((a||0)*100/b)):0;}
function completed(date){var e=readEntry(date);return !!e.workout;}
function logged(date){var e=readEntry(date);return !!(e.workout||e.water||e.steps||e.sleep||e.mood||(e.meals&&e.meals.length)||Object.values(e.habits||{}).some(Boolean));}
function streak(){var d=localDate();if(!logged(d))d=addDays(d,-1);var n=0;while(n<365&&logged(d)){n++;d=addDays(d,-1);}return n;}
function weekStart(date){var d=parseDate(date),dow=(d.getDay()+6)%7;d.setDate(d.getDate()-dow);return localDate(d);}
function weekDates(date){var s=weekStart(date);return Array.from({length:7},function(_,i){return addDays(s,i);});}
function weeklyWorkouts(){return weekDates(localDate()).filter(completed).length;}
function formatN(n){return Number(n).toLocaleString('sr-RS');}
function strip(){return '<div class="day-strip">'+weekDates(ui.date).map(function(d){var dt=parseDate(d);return '<button class="day-chip '+(ui.date===d?'selected':'')+'" data-act="select-date" data-date="'+d+'">'+weekNames[dt.getDay()]+'<small>'+dt.getDate()+'.</small></button>';}).join('')+'</div>';}
function bar(p){return '<div class="progress-track"><div class="progress-fill" style="width:'+percent(p,100)+'%"></div></div>';}
function btn(text,action,data,cls){return '<button class="btn '+(cls||'small')+'" data-act="'+action+'" '+(data||'')+'>'+text+'</button>';}
function card(t,body,add){return '<section class="card"><div class="card-head"><h3>'+t+'</h3>'+(add||'')+'</div>'+body+'</section>';}
function viewTitle(kicker,title,sub){return '<div class="view-title"><div class="eyebrow">'+kicker+'</div><h1>'+title+'</h1><p>'+sub+'</p></div>';}
function planSum(date){return mealPlan(date).reduce(function(s,m){return s+m.kcal;},0);}
function motivation(){return quotes[parseDate(localDate()).getDate()%quotes.length];}
function stat(ic,v,t,s){return '<div class="stat"><div class="stat-icon">'+ic+'</div><strong>'+v+'</strong><small>'+t+'</small><div class="muted">'+s+'</div></div>';}
function isToday(date){return date===localDate();}
function home(){
 var t=localDate(),e=readEntry(t),w=workoutFor(t),first=state.name.trim().split(' ')[0],greeting=first?', '+safe(first):'';
 var dailyTasks=[{id:'water',name:'Hidratacija',sub:formatN(e.water||0)+' / '+formatN(state.waterTarget)+' ml',icon:'💧',done:e.water>=state.waterTarget},{id:'workout',name:w?w.title:'Dan za oporavak',sub:w?w.minutes+' min · '+w.type:'Šetnja, istezanje ili odmor',icon:w?w.icon:'🌼',done:w?!!e.workout:true}];
 var body='<div class="hero"><div class="hero-card"><div class="eyebrow">✧ YOUR GLOW-UP JOURNEY</div><h1>Hej'+greeting+'!<br>Bloom at your pace.</h1><p>Nema savršenih dana. Ima malih odluka koje te svaki dan vode bliže sebi.</p>'+btn('Otvori moj današnji plan ↗','go-tab','data-target="training"','')+'</div><aside class="quote-card"><div class="icon-big">“</div><p>'+safe(motivation())+'</p><small>DAILY REMINDER ✿</small></aside></div>';
 body+='<div class="section-title"><h2>Tvoj današnji pregled ✨</h2><span class="subtitle">'+dateTitle(t)+'</span></div>';
 body+='<div class="stats">'+stat('💦',formatN(e.water||0)+' ml','Voda',percent(e.water,state.waterTarget)+'% cilja')+stat('👟',formatN(e.steps||0),'Koraci','Cilj '+formatN(state.stepsTarget))+stat('🍓',formatN(kcal(t)),'Unete kcal','Proteini '+round(protein(t))+' g')+stat('🔥',weeklyWorkouts(),'Treninzi ove nedelje',streak()+' dana u nizu')+'</div>';
 body+='<div class="section-title"><h2>Little things, big glow</h2>'+btn('+ Daily check-in','checkin','','secondary small')+'</div>';
 body+='<div class="two-col">'+card('Današnji rituali',dailyTasks.map(function(h){return '<div class="day-habit"><span class="habit-icon">'+h.icon+'</span><div class="habit-text"><b>'+safe(h.name)+'</b><small>'+safe(h.sub)+'</small></div><span class="pill '+(h.done?'sage':'')+'">'+(h.done?'✓':'U toku')+'</span></div>';}).join('')+habits.map(function(h){var done=!!(e.habits||{})[h.id];return '<div class="day-habit"><span class="habit-icon">'+h.icon+'</span><div class="habit-text"><b>'+h.name+'</b><small>'+h.sub+'</small></div><button class="check-button '+(done?'done':'')+'" data-act="habit" data-id="'+h.id+'" aria-label="Obeleži '+h.name+'">'+(done?'✓':'○')+'</button></div>';}).join(''))+
 card('Voda · sip by sip','<p class="muted">Svaki klik dodaje jednu čašu (250 ml). Možeš i da oduzmeš.</p><div class="water-cups">'+Array.from({length:Math.max(4,Math.min(12,Math.ceil(state.waterTarget/250)))},function(_,i){return '<button class="cup '+(e.water>=250*(i+1)?'filled':'')+'" data-act="set-water" data-n="'+(250*(i+1))+'" title="'+((i+1)*250)+' ml">◡</button>';}).join('')+'</div><div class="row"><b>'+formatN(e.water||0)+' ml</b><div class="row-wrap">'+btn('− 250','water-down','','ghost small')+btn('+ 250','water-up','','secondary small')+'</div></div>'+bar(percent(e.water,state.waterTarget)))+'</div>';
 body+='<div class="section-title"><h2>Šta te danas čeka?</h2>'+btn('Jelovnik ↗','go-tab','data-target="food"','secondary small')+'</div>';
 body+='<div class="two-col">'+card('Pokreni telo '+(w?w.icon:'🌿'),w?'<div class="row"><div><h3>'+safe(w.title)+'</h3><p class="muted">'+w.minutes+' min · '+w.type+' · '+(state.level==='pocetni'?'lakši tempo':'tvoj tempo')+'</p></div><span class="pill '+(e.workout?'sage':'')+'">'+(e.workout?'Urađeno':'Planirano')+'</span></div>'+btn('Otvori trening','go-tab','data-target="training"','secondary small'):'<p class="muted">Danas je dan bez planiranog treninga. Uživaj u šetnji ili odmoru bez griže savesti.</p>'+btn('Upiši aktivnost','manual-workout','','secondary small'))+
 card('Na tanjiru danas 🍓',mealPlan(t).slice(0,3).map(function(m,i){return '<div class="meal"><div class="meal-icon">'+m.icon+'</div><div class="meal-body"><b>'+mealNames[i]+'</b><small>'+safe(m.name)+'</small></div><span class="cal">~'+m.kcal+'</span></div>';}).join('')+'<div class="row" style="margin-top:12px"><small class="muted">Predlog, ne obaveza</small>'+btn('Prati obroke','go-tab','data-target="food"','secondary small')+'</div>')+'</div>';
 body+='<p class="footer-note">✿ Sitni koraci su i dalje napredak. Aplikacija ne meri ništa automatski bez unosa.</p>';
 return body;
}
function training(){
 var w=workoutFor(ui.date),e=readEntry(ui.date),sel=programs[state.program]||programs.balanced;
 var out=viewTitle('MOVE WITH LOVE','Tvoj plan treninga','Izaberi plan i prilagodi tempo. Vežbe, serije i ponavljanja su tvoja polazna tačka.');
 out+=strip();
 out+='<div class="row-wrap" style="margin-bottom:15px"><span class="pill">✿ '+sel.name+'</span><span class="pill lav">'+state.days+' dana nedeljno</span><span class="pill sage">'+(state.level==='pocetni'?'Početni nivo':state.level==='srednji'?'Srednji nivo':'Napredni nivo')+'</span></div>';
 if(!w){out+=card('Danas je dan za oporavak 🌿','<p class="muted">Odmor je deo plana. Možeš šetati, istegnuti se ili uneti dodatnu aktivnost.</p>'+btn('+ Dodaj aktivnost','manual-workout','','secondary small'));}else{
 var total=w.items.length,checks=(e.completedEx||[]);
 var workoutHtml='<div class="row"><div><span class="pill">'+w.icon+' '+w.type+'</span><h3 style="margin-top:9px">'+safe(w.title)+'</h3><p class="muted">'+w.minutes+' min okvirno · '+total+' vežbi</p></div><div class="ring" style="--pct:'+percent(checks.filter(function(x){return x.indexOf(ui.date+'|'+w.id+'|')===0;}).length,total)+'%"><span>'+checks.filter(function(x){return x.indexOf(ui.date+'|'+w.id+'|')===0;}).length+'/'+total+'</span></div></div>';
 workoutHtml+='<p class="notice">Počni sa laganim zagrevanjem 5–8 min. Ako ti nešto ne prija, smanji intenzitet ili preskoči vežbu.</p>';
 workoutHtml+='<div class="workout">'+w.items.map(function(x,i){var key=ui.date+'|'+w.id+'|'+i,check=checks.includes(key);return '<label class="exercise"><span class="num">'+String(i+1).padStart(2,'0')+'</span><span class="exname"><b>'+safe(x[0])+'</b><small style="display:block">'+x[1]+' serije</small></span><span class="exrep">'+x[2]+'</span><input type="checkbox" data-act="exercise" data-key="'+safe(key)+'" '+(check?'checked':'')+'></label>';}).join('')+'</div>';
 workoutHtml+='<div class="row" style="margin-top:18px"><span class="pill '+(e.workout?'sage':'')+'">'+(e.workout?'✓ Završeno':'Još nije završeno')+'</span>'+btn(e.workout?'✓ Urađen trening':'Završi trening ✨','complete-workout','data-minutes="'+w.minutes+'"','')+'</div>';
 if(e.workout)workoutHtml+='<p class="help" style="margin:10px 0 0">Ako je greška, možeš obrisati evidenciju iz check-in pregleda za taj dan.</p>';
 out+=card('Tvoj trening',workoutHtml);
 }
 out+='<div class="section-title"><h2>Program za celu nedelju</h2>'+btn('Promeni program','go-tab','data-target="settings"','secondary small')+'</div><div class="three-col">'+sel.workouts.map(function(w,i){return '<div class="tile"><span class="pill">'+w.icon+' DAY '+(i+1)+'</span><h3 style="margin-top:13px">'+safe(w.title)+'</h3><div class="muted">'+w.minutes+' min · '+w.items.length+' vežbi</div><div class="help" style="margin-top:8px">'+w.items.slice(0,3).map(function(x){return safe(x[0]);}).join(' · ')+'</div></div>';}).join('')+'</div>';
 out+='<div class="section-title"><h2>Kako napreduješ?</h2></div>'+card('4-week glow-up plan','<div class="item-line"><strong>1. nedelja</strong><small>Upoznaj pokrete, lagan tempo</small></div><div class="item-line"><strong>2. nedelja</strong><small>Probaj još 1–2 ponavljanja</small></div><div class="item-line"><strong>3. nedelja</strong><small>Ako je lako, blago povećaj otpor</small></div><div class="item-line"><strong>4. nedelja</strong><small>Proveri napredak, smanji tempo po potrebi</small></div><p class="help">Plan je opšti primer, ne medicinski ili individualno trenerski program. Prilagodi vežbe svom iskustvu.</p><div class="row-wrap">'+btn('+ Ručno upiši trening','manual-workout','','secondary small')+btn('Promeni cilj','go-tab','data-target="settings"','ghost small')+'</div>');
 return out;
}
function mealRow(m,i,logged,idx){return '<div class="meal"><div class="meal-icon">'+(m.icon||'🍽️')+'</div><div class="meal-body"><b>'+safe(m.name)+'</b><small>~'+round(m.kcal)+' kcal · '+round(m.protein)+' g proteina'+(m.when?' · '+safe(m.when):'')+'</small></div>'+(logged?'<button class="icon-btn" style="width:30px;height:30px;font-size:15px" data-act="remove-meal" data-n="'+idx+'" title="Ukloni unos">×</button>':'<button class="btn small secondary" data-act="add-plan-meal" data-n="'+i+'">+ Dodaj</button>')+'</div>';}
function food(){
 var e=readEntry(ui.date),total=kcal(ui.date),prot=protein(ui.date),plan=mealPlan(ui.date);
 var out=viewTitle('EAT TO FEEL GOOD','Ishrana & energija','Jednostavni predlozi sa namirnicama iz obične prodavnice. Vrednosti su približne.');
 out+=strip();
 out+='<div class="stats">'+stat('🍽️',formatN(total),'Ukupno uneto',state.calorieTarget?'Cilj '+formatN(state.calorieTarget)+' kcal':'Bez kalorijskog limita')+stat('🥚',round(prot)+' g','Proteini',state.proteinTarget?'Cilj '+state.proteinTarget+' g':'Praćenje po želji')+stat('🥗',e.meals.length,'Uneti obroci','U odabranom danu')+stat('🫶',formatN(planSum(ui.date)),'Primer jelovnika','Zbir predloga za dan')+'</div>';
 out+='<div class="section-title"><h2>Plan obroka za '+dateShort(ui.date)+'</h2>'+btn('Pregled 7 dana','week-menu','','secondary small')+'</div>';
 out+=card('Ideje za danas',plan.map(function(m,i){return mealRow(Object.assign({},m,{name:mealNames[i]+': '+m.name}),i,false);}).join('')+'<p class="help">Porcije i nutritivne vrednosti su ilustrativne; stvarne zavise od količine, sastojaka i pripreme. Dodaj samo ono što si zaista pojela.</p>');
 out+='<div class="section-title"><h2>Moj dnevnik ishrane</h2>'+btn('+ Ručni unos obroka','manual-meal','','')+'</div>';
 out+=card('Šta si unela?',e.meals.length?e.meals.map(function(m,i){return mealRow(m,i,true,i);}).join(''):'<div class="empty"><span class="sparkle">🍓</span>Još nema unetih obroka. Dodaj obrok iz predloga ili napiši šta si jela.</div>');
 if(state.calorieTarget){out+=card('Energetski cilj',bar(percent(total,state.calorieTarget))+'<p class="muted">Uneto '+total+' / '+state.calorieTarget+' kcal. Broj služi samo kao evidencija, nije ocena dana.</p>');}
 out+='<div class="nudge" style="margin-top:15px">🌷 Nije potrebno da svaki obrok meriš. Ako praćenje postane naporno, slobodno koristi samo plan obroka i navike.</div>';
 return out;
}
function calendar(){
 var y=Number(ui.month.slice(0,4)),m=Number(ui.month.slice(5,7))-1;
 var first=new Date(y,m,1,12),lead=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();
 var out=viewTitle('ONE DAY AT A TIME','Tvoj kalendar','Pregled svih dana, treninga, obroka, vode i dnevnog check-ina.');
 out+='<section class="card"><div class="calendar-head"><button class="icon-btn" data-act="month-prev" aria-label="Prethodni mesec">‹</button><h3>'+months[m].charAt(0).toUpperCase()+months[m].slice(1)+' '+y+'.</h3><button class="icon-btn" data-act="month-next" aria-label="Sledeći mesec">›</button></div><div class="month-grid">'+['Pon','Uto','Sre','Čet','Pet','Sub','Ned'].map(function(x){return '<div class="weekday">'+x+'</div>';}).join('');
 for(var i=0;i<42;i++){var date=new Date(y,m,1-lead+i,12),d=localDate(date),other=date.getMonth()!==m,log=readEntry(d),dots='';
 if(log.workout)dots+='💗';if(log.meals&&log.meals.length)dots+='🍓';if(log.water>0)dots+='💧';if(log.mood)dots+='✦';
 out+='<button class="day-cell '+(other?'other ':'')+(d===localDate()?'today ':'')+(ui.date===d?'selected':'')+'" data-act="select-calendar-date" data-date="'+d+'"><span class="number">'+date.getDate()+'</span><span class="daydots">'+dots+'</span></button>';}
 out+='</div><p class="help" style="margin:13px 0 0">💗 trening · 🍓 hrana · 💧 voda · ✦ check-in</p></section>';
 var e=readEntry(ui.date),w=workoutFor(ui.date);
 out+='<div class="section-title"><h2>'+dateTitle(ui.date)+'</h2>'+btn('Dnevni check-in','checkin','','secondary small')+'</div>';
 out+='<div class="two-col">'+card('Evidencija dana','<div class="item-line"><strong>🏋️ Trening</strong><small>'+safe(e.workout||'Nije unet')+'</small></div><div class="item-line"><strong>🍓 Obroci</strong><small>'+e.meals.length+' · '+formatN(kcal(ui.date))+' kcal</small></div><div class="item-line"><strong>💧 Voda</strong><small>'+formatN(e.water)+' ml</small></div><div class="item-line"><strong>👟 Koraci</strong><small>'+formatN(e.steps)+'</small></div><div class="item-line"><strong>😴 Spavanje</strong><small>'+(e.sleep===null?'—':safe(e.sleep)+' h')+'</small></div><div class="item-line"><strong>🌸 Raspoloženje</strong><small>'+(e.mood||'—')+'</small></div><div class="row-wrap" style="margin-top:15px">'+btn('Unesi obrok','manual-meal','','secondary small')+btn('Izmeni dan','checkin','','ghost small')+'</div>')+card('Beleška dana ✎','<p class="muted" style="white-space:pre-wrap">'+safe(e.note||'Nisi još ostavila belešku za ovaj dan.')+'</p><p class="help">Planirani trening: '+(w?safe(w.title):'Dan odmora')+'</p>'+btn('Dodaj belešku','checkin','','secondary small'))+'</div>';
 return out;
}
function chartBars(list,field,max,unit){var values=list.map(function(d){return Number(readEntry(d)[field]||0);});var limit=Math.max(max||0,...values,1);return '<div class="bar-chart">'+values.map(function(v,i){return '<div class="bar-col"><div class="bar-fill" style="height:'+Math.max(3,Math.round(v/limit*122))+'px" title="'+v+' '+unit+'"></div><small>'+weekNames[parseDate(list[i]).getDay()]+'</small></div>';}).join('')+'</div>';}
function trendWeight(){
 var data=Object.keys(state.entries).filter(function(d){return Number(state.entries[d].weight)>0;}).sort().slice(-14).map(function(d){return {d:d,n:Number(state.entries[d].weight)};});
 if(data.length<2)return '<div class="empty"><span class="sparkle">🌸</span>Unesi telesnu masu u dva različita dana da vidiš trend. Merenje je potpuno opciono.</div>';
 var vals=data.map(function(x){return x.n;});var min=Math.min.apply(null,vals)-.7,max=Math.max.apply(null,vals)+.7;var pts=data.map(function(x,i){return (16+i*(288/(data.length-1)))+','+(138-((x.n-min)/(max-min))*112);}).join(' ');
 return '<svg viewBox="0 0 320 160" class="mini-trend" aria-label="Trend telesne mase"><line x1="15" y1="138" x2="306" y2="138" stroke="#eedee6"/><polyline fill="none" stroke="#bd7096" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points="'+pts+'"/>'+data.map(function(x,i){var px=16+i*288/(data.length-1),py=138-((x.n-min)/(max-min))*112;return '<circle cx="'+px+'" cy="'+py+'" r="4.5" fill="#c8779b"><title>'+safe(x.d)+': '+x.n+' kg</title></circle>';}).join('')+'</svg><div class="row"><small class="muted">'+dateShort(data[0].d)+' · '+data[0].n+' kg</small><small class="muted">'+dateShort(data[data.length-1].d)+' · '+data[data.length-1].n+' kg</small></div>';
}
function progress(){
 var days=weekDates(localDate()),today=localDate(),e=readEntry(today),all=Object.entries(state.entries),completedCount=all.filter(function(x){return !!x[1].workout;}).length,totalMin=all.reduce(function(s,x){return s+Number(x[1].minutes||0);},0);
 var out=viewTitle('PROGRESS, NOT PERFECTION','Tvoj napredak','Prati ono što ti znači: kontinuitet, snagu, energiju i nežne navike.');
 out+='<div class="stats">'+stat('🔥',streak(),'Dnevni niz','Dan sa bilo kojim unosom')+stat('💗',completedCount,'Svi treninzi','U celom dnevniku')+stat('⏱️',formatN(totalMin),'Minuti aktivnosti','Uneti treninzi')+stat('✨',all.filter(function(x){return logged(x[0]);}).length,'Aktivni dani','Sa bar jednim unosom')+'</div>';
 out+='<div class="section-title"><h2>Tvoja poslednja nedelja</h2>'+btn('Dnevni check-in','checkin','','secondary small')+'</div>';
 out+='<div class="two-col">'+card('Koraci 👟',chartBars(days,'steps',state.stepsTarget,'koraka')+'<p class="muted">Dnevni cilj: '+formatN(state.stepsTarget)+' koraka</p>')+card('Voda 💧',chartBars(days,'water',state.waterTarget,'ml')+'<p class="muted">Dnevni cilj: '+formatN(state.waterTarget)+' ml</p>')+'</div>';
 out+='<div class="section-title"><h2>Briga o sebi</h2></div>';
 out+='<div class="two-col">'+card('Telesna masa · opciono',trendWeight()+'<div style="margin-top:12px">'+btn('+ Dodaj merenje','checkin','','secondary small')+'</div>')+card('Današnji wellness check-in','<div class="metric-grid"><div class="metric"><b>'+(e.sleep===null?'—':e.sleep+' h')+'</b><small>San</small></div><div class="metric"><b>'+(e.mood?e.mood:'—')+'</b><small>Raspoloženje</small></div><div class="metric"><b>'+(e.energy===null?'—':e.energy+'/5')+'</b><small>Energija</small></div><div class="metric"><b>'+(e.waist===null?'—':e.waist+' cm')+'</b><small>Obim struka</small></div></div><div style="margin-top:15px">'+btn('Ažuriraj podatke','checkin','','secondary small')+'</div>')+'</div>';
 var n=streak();out+='<div class="section-title"><h2>Little victories 🏆</h2></div><div class="three-col">'+[['🌱','Prvi korak',all.some(function(x){return logged(x[0]);}),'Prvi sačuvani dan'],['🌷','Flower power',n>=3,'3 dana za redom'],['👑','Consistency queen',n>=7,'7 dana u nizu'],['💪','Strong girl',completedCount>=5,'5 završenih treninga'],['💧','Hydration angel',all.filter(function(x){return Number(x[1].water)>=state.waterTarget;}).length>=5,'5 hidratacijskih dana'],['✨','Bloom era',all.filter(function(x){return logged(x[0]);}).length>=14,'14 aktivnih dana']].map(function(x){return '<div class="tile" style="'+(x[2]?'':'opacity:.52')+'"><div style="font-size:29px">'+x[0]+'</div><h3 style="margin:6px 0">'+x[1]+(x[2]?' ✓':'')+'</h3><small class="muted">'+x[3]+'</small></div>';}).join('')+'</div>';
 out+='<p class="footer-note">Napredak nije samo broj na vagi. Obrati pažnju i na to kako se osećaš.</p>';
 return out;
}
function settings(){
 var goalOpts=[['energija','Više energije i bolji osećaj'],['snaga','Snaga i mišići'],['kondicija','Više kretanja i kondicija'],['rutina','Stvaranje zdrave rutine'],['tezina','Praćenje telesne mase']].map(function(x){return '<option value="'+x[0]+'" '+(state.goal===x[0]?'selected':'')+'>'+x[1]+'</option>';}).join('');
 var progOpts=Object.entries(programs).map(function(x){return '<option value="'+x[0]+'" '+(state.program===x[0]?'selected':'')+'>'+x[1].name+'</option>';}).join('');
 var out=viewTitle('DESIGN YOUR ROUTINE','Moj plan & ciljevi','Sve možeš da prilagodiš. Napravi plan koji odgovara tvom životu, ne obrnuto.');
 out+='<div class="two-col"><section class="card"><h3>Moja rutina 🌸</h3><form id="settingsForm"><div class="field"><label for="name">Kako da te zovem?</label><input id="name" name="name" maxlength="40" value="'+safe(state.name)+'" placeholder="Tvoje ime (opciono)"></div><div class="field"><label for="goal">Moj glavni cilj</label><select id="goal" name="goal">'+goalOpts+'</select></div><div class="field"><label for="program">Program treninga</label><select id="program" name="program">'+progOpts+'</select></div><div class="form-grid"><div class="field"><label for="days">Treninga nedeljno</label><select id="days" name="days">'+[2,3,4,5,6].map(function(n){return '<option '+(state.days===n?'selected':'')+' value="'+n+'">'+n+' dana</option>';}).join('')+'</select></div><div class="field"><label for="level">Nivo</label><select id="level" name="level"><option value="pocetni" '+(state.level==='pocetni'?'selected':'')+'>Početni</option><option value="srednji" '+(state.level==='srednji'?'selected':'')+'>Srednji</option><option value="napredni" '+(state.level==='napredni'?'selected':'')+'>Napredni</option></select></div></div><div class="form-grid"><div class="field"><label>Dnevno vode (ml)</label><input type="number" name="waterTarget" min="250" max="6000" step="250" value="'+state.waterTarget+'"></div><div class="field"><label>Koraci dnevno</label><input type="number" name="stepsTarget" min="1000" max="30000" step="500" value="'+state.stepsTarget+'"></div></div><div class="form-grid"><div class="field"><label>Kalorijski cilj (opciono)</label><input type="number" name="calorieTarget" min="0" max="10000" placeholder="Bez limita" value="'+(state.calorieTarget||'')+'"></div><div class="field"><label>Proteini, g (opciono)</label><input type="number" name="proteinTarget" min="0" max="400" placeholder="Bez limita" value="'+(state.proteinTarget||'')+'"></div></div><button type="submit" class="btn full">Sačuvaj moj plan ✨</button></form></section>';
 out+='<div>'+card('Tvoj mini vodič 🌷','<p class="muted">1. Izaberi program i broj treninga nedeljno.<br>2. U kalendaru označavaj šta si radila.<br>3. Upisuj obroke, vodu, san i korake kada želiš.<br>4. Na „Napredak“ prati kontinuitet i trendove.</p><div class="nudge">💗 Podaci se čuvaju samo u pregledaču na ovom uređaju. Nema naloga, automatske sinhronizacije ni povezivanja sa Apple Health-om.</div>')+
 card('Backup & privatnost','<p class="muted">Izvezi sve podatke u JSON datoteku i sačuvaj je na sigurno. Možeš ih posle uvesti na isti ili drugi uređaj.</p><div class="row-wrap">'+btn('↓ Izvezi backup','export','','secondary small')+'<label class="btn ghost small" style="display:inline-flex;align-items:center">↑ Uvezi backup<input id="fileImport" type="file" accept=".json,application/json" style="display:none"></label></div><div style="margin-top:19px">'+btn('Obriši sve unose','reset','','ghost small')+'</div><p class="help">Nisu potrebni posebni uređaji. Vrednosti se unose ručno; app ne zna koliko si pojela, hodala ili spavala bez tvog unosa.</p>')+'</div></div>';
 out+='<p class="footer-note">made to bloom, not to burn out ✿</p>';return out;
}

/* Shaolin China preparation — separate from the general wellness plan. */
var shaolinStart='2026-12-01';
var shaolinPhases=[
 {name:'Temelji',period:'Dec 2026 – feb 2027',desc:'Izgradi naviku, tehniku pokreta, osnovnu snagu i miran ritam.',sessions:3},
 {name:'Snaga i izdržljivost',period:'Mar – maj 2027',desc:'Postepeno duži treninzi, ravnoteža, osnovni stavovi i više hodanja.',sessions:4},
 {name:'Shaolin baza',period:'Jun – avg 2027',desc:'Više vremena na nogama, mobilnost i osnovni stavovi bez forsiranja.',sessions:4},
 {name:'Kamp simulacija',period:'Sep 2027 nadalje',desc:'Prilagodi poslednjih 4–6 nedelja stvarnom terminu i zahtevima škole; bez naglog povećanja opterećenja.',sessions:4}
];
var shaolinDays=[
 {title:'Snaga A + hodanje',icon:'💪',tasks:[['Zagrevanje i mobilnost','8 min'],['Čučanj do stolice','2 × 8–10'],['Sklek uz zid ili povišenje','2 × 6–10'],['Glute bridge','2 × 10–12'],['Bird dog','2 × 8 / strana'],['Brzo hodanje','20–30 min']]},
 {title:'Mobilnost + disanje',icon:'🧘',tasks:[['Lagano razgibavanje zglobova','5 min'],['Mobilnost kukova i skočnih zglobova','10 min'],['Lagano istezanje zadnje lože','5 min'],['Ravnoteža na jednoj nozi uz oslonac','3 × 20 s'],['Mirno disanje / meditacija','5–10 min']]},
 {title:'Kondicija + core',icon:'🥋',tasks:[['Zagrevanje hodanjem','5 min'],['Brži hod ili lagani bicikl','25–35 min'],['Step-up na nisku stepenicu','2 × 8 / noga'],['Dead bug','2 × 8 / strana'],['Plank na kolenima','2 × 15–25 s']]},
 {title:'Aktivni oporavak',icon:'🌿',tasks:[['Lagana šetnja po želji','20–30 min'],['Nežna mobilnost','10 min'],['Kratka meditacija','5 min']]},
 {title:'Snaga B + stavovi',icon:'🌸',tasks:[['Zagrevanje','8 min'],['Iskorak unazad uz oslonac','2 × 6–8 / noga'],['Veslanje gumom ili laganom bučicom','2 × 10'],['Podizanje na prste','2 × 12'],['Blagi horse stance uz viši položaj','3 × 15–20 s'],['Istezanje i disanje','8 min']]},
 {title:'Duga lagana šetnja',icon:'👟',tasks:[['Šetnja u razgovornom tempu','40–60 min'],['Mobilnost nogu i leđa','10 min'],['Kratka refleksija','5 min']]},
 {title:'Odmor + refleksija',icon:'☁️',tasks:[['Odmor bez obaveznog treninga','—'],['Kako se osećam i šta mi prija?','5 min'],['Priprema naredne nedelje','5 min']]}
];
function shaolinPhase(date){var d=parseDate(date);return d<new Date(2027,2,1)?0:d<new Date(2027,5,1)?1:d<new Date(2027,8,1)?2:3;}
function shaolinWeek(date){return Math.max(1,Math.floor((parseDate(date)-parseDate(shaolinStart))/604800000)+1);}
function shaolinTasks(date){var d=parseDate(date),index=(d.getDay()+6)%7;return {day:shaolinDays[index],index:index,phase:shaolinPhase(date)};}
function shaolinChecked(date,id){return !!(readEntry(date).habits||{})['shaolin_'+id];}
function shaolin(){
 var date=ui.date,info=shaolinTasks(date),p=shaolinPhases[info.phase],day=info.day;
 var out=viewTitle('CHINA 2027 · SIX-WEEK CAMP','Shaolin Preparation 🥋','Tvoj dugoročni plan za fizičku i mentalnu pripremu za šest nedelja u Kini.');
 out+='<div class="hero-card" style="min-height:0;margin-bottom:18px"><div class="eyebrow">THE DISCIPLINE ERA ✿</div><h1>Strong body.<br>Calm mind.</h1><p>Pripreme počinju lagano. Fokus: izdržljivost, snaga, pokretljivost i svakodnevna disciplina — bez izgladnjivanja i pretreniranosti.</p><span class="pill lav">Cilj: posle leta 2027.</span></div>';
 out+='<div class="stats">'+stat('🥋',''+shaolinWeek(date),'Nedelja plana','Od 1. decembra 2026.')+stat('🌸',(info.phase+1)+'/4','Faza pripreme',p.name)+stat('📅','6','Nedelja u Kini','Planirani boravak')+stat('✨',weekDates(date).reduce(function(n,d){return n+(shaolinChecked(d,'day')?1:0);},0)+'/7','Dani praćenja','Ove nedelje')+'</div>';
 out+='<div class="section-title"><h2>Faze tvog puta</h2></div><div class="two-col">'+shaolinPhases.map(function(x,i){return '<div class="tile" style="'+(i===info.phase?'border-color:#ca7fa5;background:#fff4f8':'')+'"><span class="pill '+(i===info.phase?'lav':'')+'">FAZA '+(i+1)+(i===info.phase?' · AKTUELNA':'')+'</span><h3 style="margin:12px 0 5px">'+x.name+'</h3><small class="muted">'+x.period+'</small><p class="muted">'+x.desc+'</p></div>';}).join('')+'</div>';
 out+='<div class="section-title"><h2>Tvoj dnevni plan</h2><span class="subtitle">'+dateTitle(date)+'</span></div>'+strip();
 var done=0;var list=day.tasks.map(function(t,i){var key='task_'+i,checked=shaolinChecked(date,key);if(checked)done++;return '<label class="exercise"><span class="num">'+String(i+1).padStart(2,'0')+'</span><span class="exname"><b>'+safe(t[0])+'</b><small style="display:block">'+safe(t[1])+'</small></span><input type="checkbox" data-act="shaolin-check" data-key="'+key+'" '+(checked?'checked':'')+'></label>';}).join('');
 out+=card(day.icon+' '+day.title+' · '+p.name,'<p class="muted">Ovo je početna nedelja kao bezbedna polazna tačka. Kasnije postepeno produžavaj trajanje i povećavaj serije samo kada se dobro oporavljaš. Na dane oporavka nema obaveznog napora.</p><div class="workout">'+list+'</div><div class="row" style="margin-top:16px"><span class="pill">'+done+'/'+day.tasks.length+' zadataka</span>'+btn(shaolinChecked(date,'day')?'✓ Dan završen':'Završi dan ✨','shaolin-finish','','secondary small')+'</div>');
 out+='<div class="section-title"><h2>Mentalni trening</h2></div>';
 var rituals=[['mind','5–10 min meditacije ili mirnog disanja','🧘'],['journal','Zapiši jednu stvar koju si danas savladala','📓'],['phone','30 min bez telefona pre spavanja','📵'],['sleep','Redovan san i vreme za oporavak','🌙']];
 out+=card('Daily discipline, soft power',rituals.map(function(t){return '<label class="exercise"><span class="num">'+t[2]+'</span><span class="exname"><b>'+t[1]+'</b></span><input type="checkbox" data-act="shaolin-check" data-key="'+t[0]+'" '+(shaolinChecked(date,t[0])?'checked':'')+'></label>';}).join(''));
 out+='<div class="section-title"><h2>Kontrola spremnosti · jednom mesečno</h2></div>';
 out+=card('Tvoj baseline, ne takmičenje','<p class="muted">Na kraju meseca zabeleži: koliko minuta možeš udobno da hodaš, broj kontrolisanih čučnjeva i sklekova uz oslonac, plank i subjektivnu energiju. Ne radi testove do iscrpljenja.</p><div class="row-wrap">'+btn('Dodaj belešku i energiju','checkin','','secondary small')+btn('Vidi napredak','go-tab','data-target="progress"','ghost small')+'</div>');
 out+='<div class="nudge" style="margin-top:16px">💗 Važno: ovo je pripremni, početnički plan, ne stvarni raspored konkretne škole. Pošto si ranije pominjala jak umor i žeđ, pre pojačavanja intenziteta proveri rezultate sa lekarom. Prekini vežbu kod vrtoglavice, bola u grudima ili neobične slabosti. Plan ishrane nije restriktivna dijeta.</div>';
 return out;
}

function render(){var views={shaolin:shaolin,home:home,training:training,food:food,calendar:calendar,progress:progress,settings:settings};document.getElementById('app').innerHTML=views[ui.tab]();document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===ui.tab);});document.getElementById('topDate').textContent=weekNames[new Date().getDay()]+', '+dateShort(localDate());}
function go(tab){ui.tab=tab;render();window.scrollTo({top:0,behavior:'smooth'});}
var toastTimer;
function toast(msg){var el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove('show');},2600);}
function modal(title,body){document.getElementById('modalTitle').textContent=title;document.getElementById('modalBody').innerHTML=body;document.getElementById('modal').hidden=false;document.body.style.overflow='hidden';}
function closeModal(){document.getElementById('modal').hidden=true;document.body.style.overflow='';}
function checkin(){
 var e=readEntry(ui.date);
 modal('Daily check-in · '+dateShort(ui.date),'<form id="checkinForm"><p class="help">Sve je opciono. Upisuješ ono što želiš da pratiš.</p><div class="form-grid">'+
 '<div class="field"><label>Koraci</label><input type="number" min="0" max="100000" step="1" name="steps" value="'+(e.steps||'')+'" placeholder="npr. 6500"></div>'+
 '<div class="field"><label>Voda (ml)</label><input type="number" min="0" max="15000" step="50" name="water" value="'+(e.water||'')+'" placeholder="npr. 1500"></div>'+
 '<div class="field"><label>San (sati)</label><input type="number" min="0" max="24" step=".5" name="sleep" value="'+(e.sleep===null?'':e.sleep)+'" placeholder="npr. 7.5"></div>'+
 '<div class="field"><label>Energija</label><select name="energy"><option value="">Ne unosim</option>'+[1,2,3,4,5].map(function(x){return '<option value="'+x+'" '+(e.energy===x?'selected':'')+'>'+x+' / 5</option>';}).join('')+'</select></div>'+
 '<div class="field"><label>Raspoloženje</label><select name="mood">'+[['','Ne unosim'],['😊','😊 Dobro'],['🥰','🥰 Odlično'],['😌','😌 Mirno'],['😐','😐 Tako-tako'],['😔','😔 Teško']].map(function(x){return '<option value="'+x[0]+'" '+(e.mood===x[0]?'selected':'')+'>'+x[1]+'</option>';}).join('')+'</select></div>'+
 '<div class="field"><label>Telesna masa (kg) · opciono</label><input type="number" name="weight" min="15" max="400" step=".1" placeholder="Neobavezno" value="'+(e.weight===null?'':e.weight)+'"></div>'+
 '<div class="field"><label>Obim struka (cm) · opciono</label><input type="number" name="waist" min="20" max="250" step=".5" placeholder="Neobavezno" value="'+(e.waist===null?'':e.waist)+'"></div>'+
 '<div class="field"><label>Trajanje aktivnosti (min)</label><input type="number" name="minutes" min="0" max="1440" step="1" value="'+(e.minutes||'')+'"></div></div>'+
 '<div class="field"><label>Beleška dana</label><textarea name="note" maxlength="1000" placeholder="Kako sam se danas osećala?">'+safe(e.note||'')+'</textarea></div>'+
 '<div class="row-wrap"><label style="font-size:12px"><input type="checkbox" name="clearWorkout"> Ukloni evidentirani trening (ako je greška)</label></div>'+
 '<div class="form-actions"><button type="button" class="btn ghost" data-close="1">Otkaži</button><button class="btn" type="submit">Sačuvaj ✨</button></div></form>');
}
function manualMeal(){
 modal('Upiši svoj obrok 🍽️','<form id="mealForm"><div class="field"><label>Naziv obroka *</label><input name="name" required maxlength="100" placeholder="Npr. sendvič sa piletinom"></div><div class="form-grid"><div class="field"><label>Kalorije (procena)</label><input type="number" name="kcal" min="0" max="10000" placeholder="0 ako ne pratiš"></div><div class="field"><label>Proteini (g)</label><input type="number" name="protein" min="0" max="300" step=".1" placeholder="Opciono"></div></div><div class="field"><label>Vrsta obroka</label><select name="when"><option>Doručak</option><option>Ručak</option><option>Večera</option><option>Užina</option><option>Ostalo</option></select></div><p class="help">Ne moraš da brojiš kalorije. Za jednostavan dnevnik ostavi ta polja prazna.</p><button class="btn full" type="submit">Dodaj u dnevnik 🌷</button></form>');
}
function manualWorkout(){
 modal('Dodaj aktivnost ♡','<form id="workoutForm"><div class="field"><label>Aktivnost *</label><select name="name"><option>Šetnja</option><option>Pilates</option><option>Teretana</option><option>Trčanje</option><option>Joga</option><option>Bicikl</option><option>Ples</option><option>Plivanje</option><option>Drugi trening</option></select></div><div class="field"><label>Trajanje u minutima</label><input name="minutes" type="number" required min="1" max="1440" value="30"></div><p class="help">Ako već postoji trening za ovaj dan, novi unos će zameniti njegov naziv i trajanje.</p><button class="btn full" type="submit">Sačuvaj aktivnost ✨</button></form>');
}
function weekMenu(){
 var a=weekDates(ui.date),out='<p class="help">Sedmodnevni primer jelovnika. Slobodno zameni obroke i prilagodi porcije apetitu, aktivnostima i potrebama.</p><div class="meal-plan-table">';
 out+=a.map(function(d){var f=mealPlan(d);return '<div class="meal-plan-day"><b>'+weekNames[parseDate(d).getDay()]+' · '+dateShort(d)+' · oko '+planSum(d)+' kcal*</b><p>'+f.map(function(x,i){return mealNames[i]+': '+safe(x.name);}).join('<br>')+'</p><button class="text-button" data-act="use-menu-day" data-date="'+d+'">Otvori ovaj dan ↗</button></div>';}).join('');
 out+='</div><p class="help">*Zbir primera, nije preporučeni dnevni unos. Plan nije personalizovana dijeta.</p>';
 modal('Jelovnik · 7 dana 🍓',out);
}
function exportData(){
 var data=JSON.stringify(Object.assign({},state,{exportedAt:new Date().toISOString()}),null,2);
 var blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='bloom-club-backup-'+localDate()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);toast('Backup je pripremljen za čuvanje ♡');
}
document.addEventListener('click',function(ev){
 var nav=ev.target.closest('[data-tab]');if(nav){go(nav.dataset.tab);return;}
 var close=ev.target.closest('[data-close]');if(close){closeModal();return;}
 var el=ev.target.closest('[data-act]');if(!el)return;
 var a=el.dataset.act,e=entry(ui.date),d=el.dataset.date;
 if(a==='go-tab'){go(el.dataset.target);return;}
 if(a==='shaolin-check'){var sh=entry(ui.date);sh.habits=sh.habits||{};var hk='shaolin_'+el.dataset.key;sh.habits[hk]=!sh.habits[hk];save();render();return;}
 if(a==='shaolin-finish'){var sh2=entry(ui.date);sh2.habits=sh2.habits||{};sh2.habits.shaolin_day=!sh2.habits.shaolin_day;save();render();toast(sh2.habits.shaolin_day?'Shaolin dan sačuvan 🥋':'Oznaka dana uklonjena');return;}
 if(a==='select-date'||a==='select-calendar-date'){ui.date=d;if(a==='select-calendar-date')ui.month=d.slice(0,7);render();return;}
 if(a==='month-prev'||a==='month-next'){var x=new Date(Number(ui.month.slice(0,4)),Number(ui.month.slice(5,7))-1+(a==='month-next'?1:-1),1,12);ui.month=localDate(x).slice(0,7);render();return;}
 if(a==='water-up'||a==='water-down'){var t=entry(localDate());t.water=Math.max(0,Math.min(15000,t.water+(a==='water-up'?250:-250)));save();render();return;}
 if(a==='set-water'){var v=Number(el.dataset.n),t2=entry(localDate());t2.water=t2.water===v?v-250:v;save();render();return;}
 if(a==='habit'){var h=entry(localDate());h.habits=h.habits||{};h.habits[el.dataset.id]=!h.habits[el.dataset.id];save();render();return;}
 if(a==='exercise'){var key=el.dataset.key;if(!e.completedEx)e.completedEx=[];if(e.completedEx.includes(key))e.completedEx=e.completedEx.filter(function(v){return v!==key;});else e.completedEx.push(key);save();render();return;}
 if(a==='complete-workout'){var w=workoutFor(ui.date);if(!w)return;if(e.workout){toast('Trening je već sačuvan ♡');return;}e.workout=w.title;e.minutes=num(el.dataset.minutes,0,1440,0);save();render();toast('Bravo! Jedan korak bliže sebi 💗');return;}
 if(a==='add-plan-meal'){var f=mealPlan(ui.date)[Number(el.dataset.n)];if(!f)return;e.meals.push(Object.assign({when:mealNames[Number(el.dataset.n)]},f));save();render();toast('Obrok dodat u dnevnik 🍓');return;}
 if(a==='remove-meal'){var ix=Number(el.dataset.n);if(ix>=0&&ix<e.meals.length)e.meals.splice(ix,1);save();render();toast('Unos uklonjen');return;}
 if(a==='checkin'){checkin();return;}
 if(a==='manual-meal'){manualMeal();return;}
 if(a==='manual-workout'){manualWorkout();return;}
 if(a==='week-menu'){weekMenu();return;}
 if(a==='use-menu-day'){ui.date=d;closeModal();go('food');return;}
 if(a==='export'){exportData();return;}
 if(a==='reset'){if(confirm('Da li sigurno želiš da obrišeš SVE unose i ciljeve sa ovog uređaja? Ova radnja se ne može poništiti bez backupa.')){state=defaults();save();ui.date=localDate();go('home');toast('Lokalni podaci su obrisani.');}return;}
});
document.addEventListener('submit',function(ev){
 var form=ev.target;if(!['checkinForm','mealForm','workoutForm','settingsForm'].includes(form.id))return;ev.preventDefault();
 var data=new FormData(form),e=entry(ui.date);
 if(form.id==='checkinForm'){
 e.steps=num(data.get('steps'),0,100000,0);e.water=num(data.get('water'),0,15000,0);
 e.sleep=data.get('sleep')===''?null:num(data.get('sleep'),0,24,null);
 e.energy=data.get('energy')===''?null:num(data.get('energy'),1,5,null);
 e.mood=String(data.get('mood')||'');
 e.weight=data.get('weight')===''?null:num(data.get('weight'),15,400,null);
 e.waist=data.get('waist')===''?null:num(data.get('waist'),20,250,null);
 e.minutes=num(data.get('minutes'),0,1440,0);
 e.note=String(data.get('note')||'').slice(0,1000);
 if(data.get('clearWorkout')){e.workout=null;e.minutes=0;e.completedEx=[];}
 }
 if(form.id==='mealForm'){e.meals.push({name:String(data.get('name')||'Obrok').slice(0,100),kcal:num(data.get('kcal'),0,10000,0),protein:num(data.get('protein'),0,300,0),when:String(data.get('when')||''),icon:'🍽️'});}
 if(form.id==='workoutForm'){e.workout=String(data.get('name')||'Aktivnost').slice(0,100);e.minutes=num(data.get('minutes'),1,1440,30);}
 if(form.id==='settingsForm'){
 state.name=String(data.get('name')||'').slice(0,40);
 state.goal=['energija','snaga','kondicija','rutina','tezina'].includes(data.get('goal'))?data.get('goal'):'energija';
 state.program=Object.prototype.hasOwnProperty.call(programs,data.get('program'))?data.get('program'):'balanced';
 state.level=['pocetni','srednji','napredni'].includes(data.get('level'))?data.get('level'):'pocetni';
 state.days=num(data.get('days'),2,6,3);
 state.waterTarget=num(data.get('waterTarget'),250,6000,2000);
 state.stepsTarget=num(data.get('stepsTarget'),1000,30000,8000);
 state.calorieTarget=data.get('calorieTarget')===''?null:num(data.get('calorieTarget'),0,10000,null);
 state.proteinTarget=data.get('proteinTarget')===''?null:num(data.get('proteinTarget'),0,400,null);
 }
 save();closeModal();render();toast('Sačuvano! ✨');
});
document.addEventListener('change',function(ev){
 if(ev.target&&ev.target.id==='fileImport'){
 var f=ev.target.files&&ev.target.files[0];if(!f)return;
 if(f.size>3000000){toast('Fajl je prevelik.');return;}
 var reader=new FileReader();reader.onload=function(){
 try{var obj=JSON.parse(reader.result);if(!obj||typeof obj!=='object'||!obj.entries||typeof obj.entries!=='object'||Array.isArray(obj.entries))throw Error('Format');
 if(!confirm('Uvoz će zameniti trenutne podatke sa ovog uređaja. Nastavi?'))return;
 var cleaned=defaults();Object.keys(cleaned).forEach(function(k){if(Object.prototype.hasOwnProperty.call(obj,k)&&k!=='entries')cleaned[k]=obj[k];});
 Object.keys(obj.entries).forEach(function(k){if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&obj.entries[k]&&typeof obj.entries[k]==='object'&&!Array.isArray(obj.entries[k]))cleaned.entries[k]=Object.assign(entryBlank(),obj.entries[k]);});
 state=cleaned;save();ui.date=localDate();go('home');toast('Backup uspešno uvezen ♡');
 }catch(err){toast('Ovaj JSON nije važeći Bloom Club backup.');}};reader.readAsText(f);ev.target.value='';
 }
});
function entryBlank(){return {water:0,steps:0,sleep:null,mood:null,energy:null,meals:[],workout:null,minutes:0,completedEx:[],habits:{},weight:null,waist:null,note:''};}
window.addEventListener('storage',function(ev){if(ev.key===STORE){try{state=Object.assign(defaults(),JSON.parse(ev.newValue||'{}'));render();}catch(e){}}});
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){});});}
render();
})();
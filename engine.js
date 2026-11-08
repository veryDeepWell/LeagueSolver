// Explicit deterministic training-dummy model. All time is in seconds.
export const ITEMS=[
 {id:'4633',name:'Рифтмейкер',ap:70,hp:350,haste:15,cost:3100,tag:'HP → AP'},
 {id:'3084',name:'Стальное сердце',hp:900,cost:3000,tag:'Стаки HP'},
 {id:'3116',name:'Скипетр Рилай',ap:65,hp:400,cost:2600,tag:'Замедление 30%'},
 {id:'6653',name:'Мучения Лиандри',ap:60,hp:300,cost:3000,tag:'Горение 2% HP/с'},
 {id:'3089',name:'Шляпа Рабадона',ap:130,cost:3500,tag:'+30% AP'},
 {id:'3135',name:'Посох Бездны',ap:95,pen:.4,cost:3000,tag:'40% пробивания'},
 {id:'3065',name:'Облачение духов',hp:400,mr:50,haste:10,cost:2700,tag:'+25% лечения'},
 {id:'3083',name:'Доспех Вармога',hp:1000,cost:3100,tag:'+12% HP предметов'}
];
export const ORDERS=['QEW','QWE','EQW','EWQ','WQE','WEQ'];
export const DEFAULTS={level:11,souls:40,duration:12,mr:60,armor:80,targetHP:2500,targets:1,bolts:3,budget:9500,slots:3,heartHP:0,heartProcs:true,rune:'conqueror',grievous:0,order:'QEW'};
export const growth=l=>(.7025+.0175*(l-1))*(l-1);
export const mitigation=r=>r>=0?100/(100+r):2-100/(100-r);
export function skillOrder(level,priority='QEW'){
 const ranks={Q:0,W:0,E:0,R:0},sequence=[];
 for(let l=1;l<=level;l++){
  let s;if([6,11,16].includes(l))s='R';else if(l<=3)s=priority[l-1];else s=[...priority].find(k=>ranks[k]<5&&ranks[k]<Math.ceil(l/2));
  ranks[s]++;sequence.push(s);
 }return {ranks,sequence};
}
export function stats(ids,c,extraHP=0,conq=0){
 const items=ids.map(id=>ITEMS.find(i=>i.id===id));
 const sum=k=>items.reduce((s,i)=>s+(i[k]||0),0),has=id=>ids.includes(id);
 const itemHP=sum('hp')*(has('3083')?1.12:1);
 const bonusHP=itemHP+c.souls*15+(has('3084')?c.heartHP:0)+extraHP;
 const conversion=has('4633')?bonusHP*.02:0;
 return {hp:595+99*growth(c.level)+bonusHP,bonusHP,itemHP,ap:(sum('ap')+conversion+conq)*(has('3089')?1.3:1),conversion,haste:sum('haste'),mr:34+1.55*growth(c.level)+sum('mr'),armor:23+4.7*growth(c.level),pen:sum('pen'),cost:sum('cost'),mana:400+29*growth(c.level)};
}
export function simulate(ids,input={}){
 const c={...DEFAULTS,...input},has=id=>ids.includes(id),{ranks,sequence}=skillOrder(c.level,c.order);
 const base=stats(ids,c),events=[],schedule=(t,type,extra={})=>{if(t<=c.duration+1e-8)events.push({t,type,...extra});};
 let mana=base.mana-(ranks.R?100:0),manaTime=0,castLock=0;
 const next={Q:0,W:0,E:0,F:2},cost={Q:[40,45,50,55,60],W:[60,65,70,75,80],E:[50,55,60,65,70]};
 const cds={Q:[7,6,5,4,3],W:[20,19,18,17,16],E:[12,11.5,11,10.5,10]};
 // Schedule legal casts with a 0.25s shared cast lock and full mana at start.
 while(true){
  const eligible=['E','Q','W',...(ranks.R?['F']:[])].filter(k=>k==='F'||ranks[k]);
  const k=eligible.sort((a,b)=>Math.max(next[a],castLock)-Math.max(next[b],castLock))[0];
  const t=Math.max(next[k],castLock);if(t>c.duration)break;
  mana=Math.min(base.mana,mana+(t-manaTime)*(10+.8*growth(c.level))/5);manaTime=t;
  const price=k==='F'?0:cost[k][ranks[k]-1];
  if(mana+1e-8<price){next[k]=t+(price-mana)/((10+.8*growth(c.level))/5);continue;}
  mana-=price;castLock=t+.25;
  schedule(t+(k==='W'?1.5:k==='E'?.75:.25),k,{cast:t});
  next[k]=t+(k==='F'?8:cds[k][ranks[k]-1]/(1+base.haste/100));
 }
 if(ranks.R)for(let t=.5;t<=c.duration+1e-8;t+=.5)schedule(t,'R');
 if(has('3084')&&c.heartProcs)for(let n=0;n<c.targets;n++)for(let t=3+n;t<=c.duration;t+=30)schedule(t,'H');
 // Liandry ticks on a global 0.5s grid; one refreshed burn per target, no stacking.
 if(has('6653'))for(let t=.5;t<=c.duration;t+=.5)schedule(t,'B');
 events.sort((a,b)=>a.t-b.t||(['B'].includes(a.type)?1:0)-(['B'].includes(b.type)?1:0));
 let extraHP=0,stacks=0,lastStack=-Infinity,lastR=-Infinity,firstCombat=null,burnUntil=-1,damage=0,healing=0,soulsGained=0;
 const breakdown={},heals={},timeline=[{t:0,damage:0,healing:0}],log=[];
 const conqPer=1.8+(4.26-1.8)*(c.level-1)/17;
 const heal=(value,key)=>{const v=value*(has('3065')?1.25:1)*(1-c.grievous);healing+=v;heals[key]=(heals[key]||0)+v;return v;};
 for(const e of events){
  if(e.t-lastStack>5)stacks=0;
  const s=stats(ids,c,extraHP,c.rune==='conqueror'?stacks*conqPer:0);
  const elapsed=firstCombat===null?0:Math.max(0,e.t-firstCombat);
  const amp=(has('4633')?1+.02*Math.min(4,Math.floor(elapsed+1e-7)):1)*(has('6653')?1+.02*Math.min(3,Math.floor(elapsed+1e-7)):1);
  let raw=0,count=c.targets,physical=false,source=e.type;
  if(e.type==='Q')raw=([60,90,120,150,180][ranks.Q-1]+.45*s.ap)*(1+.25*(c.bolts-1));
  if(e.type==='W')raw=[70,115,160,205,250][ranks.W-1]+.6*s.ap;
  if(e.type==='E')raw=[90,130,170,210,250][ranks.E-1]+.7*s.ap;
  if(e.type==='F')raw=[150,250,350][ranks.R-1]+.4*s.ap;
  if(e.type==='R'){raw=([15,25,35][ranks.R-1]+.04*s.ap)*.5;heal(([15,30,45][ranks.R-1]+.05*s.ap+.015*s.bonusHP)*.5*c.targets,'R');}
  if(e.type==='H'){raw=70+.06*s.hp;count=1;physical=true;extraHP+=raw*.1;}
  if(e.type==='B'){if(e.t>burnUntil+1e-8)continue;raw=.01*c.targetHP;source='Лиандри';}
  const dealt=raw*count*mitigation(physical?c.armor:c.mr*(1-s.pen))*amp;
  if(dealt>0){if(firstCombat===null)firstCombat=e.t;damage+=dealt;breakdown[source]=(breakdown[source]||0)+dealt;
   if(has('4633')&&elapsed>=4)heal(dealt*.06,'Рифтмейкер');
   if(c.rune==='conqueror'&&stacks===12)heal(dealt*.05,'Завоеватель');
  }
  if(['Q','W','E','F','R'].includes(e.type)){
   burnUntil=e.t+3;
   if(c.rune==='conqueror'){
    if(e.type!=='R'||e.t-lastR>=4){stacks=Math.min(12,stacks+2);if(e.type==='R')lastR=e.t;}
    lastStack=e.t;
   }
  }
  if(e.type==='H'&&c.rune==='conqueror'){stacks=Math.min(12,stacks+1);lastStack=e.t;}
  if(['W','E'].includes(e.type)){
   // Each hit/pull yields one fragment per target, acquired at the hit time.
   for(let n=0;n<c.targets;n++){extraHP+=15;soulsGained++;heal(stats(ids,c,extraHP).hp*.06,'Пассивка');}
  }
  timeline.push({t:e.t,damage,healing});
  if(e.type!=='B')log.push({t:e.t,type:e.type,damage:dealt,ap:s.ap,stacks});
 }
 const end=stats(ids,c,extraHP,c.rune==='conqueror'?stacks*conqPer:0);
 return {ids,c,ranks,sequence,base,end,damage,healing,dps:damage/c.duration,breakdown,heals,timeline,log,soulsGained,extraHP,mana,stacks};
}
export function combinations(values,n,start=0,prefix=[]){if(n===0)return [prefix];let out=[];for(let i=start;i<=values.length-n;i++)out.push(...combinations(values,n-1,i+1,[...prefix,values[i]]));return out;}
export function solve(input,metric='damage'){
 const c={...DEFAULTS,...input};let tested=0;const results=[];
 const value=r=>metric==='hp'?r.end.hp:r[metric];
 for(const ids of combinations(ITEMS.map(i=>i.id),c.slots)){
  if(stats(ids,c).cost>c.budget)continue;
  let best=null;for(const order of ORDERS){const r=simulate(ids,{...c,order});tested++;if(!best||value(r)>value(best))best=r;}
  results.push(best);
 }results.sort((a,b)=>value(b)-value(a)||a.base.cost-b.base.cost);return {results,tested};
}

"use client";
import {useEffect,useState,type CSSProperties} from "react";
import {createPortal} from "react-dom";
import Link from "next/link";
import {Droplets,CheckCircle2,BookOpen,Trophy,ArrowRight,ShieldAlert,BarChart3,ClipboardCheck,PartyPopper,Save,ShieldCheck,Plus,Minus,Sparkles,X,ArrowLeft,Target} from "lucide-react";
import type {Lang} from "@/lib/content";
import {saveProgress,useProgress} from "@/lib/progress-cloud";

function CounterControl({label,value,min,max,onChange,lang,suffix}:{label:string;value:number;min:number;max:number;onChange:(n:number)=>void;lang:Lang;suffix?:string}){
 const ar=lang==="ar";
 return <div className="water-counter">
  <label className="counter-label" id={"counter-"+label}>{label}<small>{suffix}</small></label>
  <div className="counter-stepper" role="group" aria-label={label}>
   <button type="button" aria-label={(ar?"قلّل ":"Decrease ")+label} disabled={value<=min} onClick={()=>onChange(Math.max(min,value-1))}><Minus size={19} strokeWidth={2.6}/></button>
   <output aria-live="off" aria-label={label} className="counter-number">{value.toLocaleString(ar?"ar-EG":"en-US")}</output>
   <button type="button" aria-label={(ar?"زوّد ":"Increase ")+label} disabled={value>=max} onClick={()=>onChange(Math.min(max,value+1))}><Plus size={19} strokeWidth={2.6}/></button>
  </div>
 </div>;
}
export function WaterCalculator({lang}:{lang:Lang}){
 const ar=lang==="ar";const [people,setPeople]=useState(3),[shower,setShower]=useState(8),[tap,setTap]=useState(3),[laundry,setLaundry]=useState(4),[saved,setSaved]=useState(false);
 const daily=Math.round(people*(shower*9+tap*6)+laundry*65/7);
 const potential=Math.round(people*(Math.min(1,shower)*9+Math.min(1,tap)*6));
 const update=(setter:(n:number)=>void)=>(n:number)=>{setter(n);setSaved(false);};
 return <section className="stack">
  <div className="panel calculator-panel">
   <span className="tag"><Droplets size={15}/>{ar?"حاسبة استخدام المياه":"Water use calculator"}</span>
   <h2 style={{marginTop:17}}>{ar?"احسب أنشطتك اليومية":"Estimate your daily activities"}</h2>
   <p className="muted small">{ar?"غيّر الأعداد باستخدام + و− وشوف تقدير استهلاك الأنشطة دي في اليوم.":"Use + and − to adjust your habits and see a daily estimate."}</p>
   <div className="counter-grid">
    <CounterControl lang={lang} label={ar?"الأشخاص في البيت":"People at home"} value={people} min={1} max={12} onChange={update(setPeople)}/>
    <CounterControl lang={lang} label={ar?"دقائق الدش للفرد":"Shower minutes per person"} suffix={ar?"في اليوم":"per day"} value={shower} min={0} max={30} onChange={update(setShower)}/>
    <CounterControl lang={lang} label={ar?"دقائق فتح الحنفية للفرد":"Tap-running minutes per person"} suffix={ar?"في اليوم":"per day"} value={tap} min={0} max={30} onChange={update(setTap)}/>
    <CounterControl lang={lang} label={ar?"مرات الغسيل":"Laundry loads"} suffix={ar?"في الأسبوع":"per week"} value={laundry} min={0} max={21} onChange={update(setLaundry)}/>
   </div>
   <div className="calculator-result"><span><Droplets size={19}/>{ar?"الاستهلاك اليومي التقريبي":"Estimated daily use"}</span><strong>{daily.toLocaleString(ar?"ar-EG":"en-US")} <small>{ar?"لتر / يوم":"liters / day"}</small></strong><p>{ar?"النتيجة للأنشطة المذكورة فقط، مش استهلاك البيت بالكامل.":"For these activities only, not your full household use."}</p></div>
   <div className="action-row"><button type="button" className="btn btn-primary" onClick={()=>{saveProgress({estimate:daily});setSaved(true)}}><Save size={18}/>{ar?"احفظ النتيجة في حسابي":"Save my estimate"}</button>{saved&&<span className="tag" role="status"><CheckCircle2 size={15}/>{ar?"اتحفظت النتيجة":"Estimate saved"}</span>}</div>
   <p className="muted small calculator-assumptions">{ar?"الحساب مبني على متوسطات توضيحية: الدش 9 لتر/دقيقة، الحنفية 6 لتر/دقيقة، والغسلة 65 لتر.":"Illustrative assumptions: shower 9 L/min, tap 6 L/min, laundry 65 L/load."}</p>
  </div>
  <div className="panel savings-scenario"><span className="tag"><Sparkles size={15}/>{ar?"فكرة للترشيد":"A water-wise idea"}</span><h3>{ar?"دقيقة واحدة ممكن تعمل فرق":"One minute can make a difference"}</h3><p className="muted">{ar?"لو كل فرد قلّل دقيقة من الدش ودقيقة من فتح الحنفية كل يوم، الفرق الحسابي ممكن يكون:":"If each person reduces their shower and running-tap use by one minute daily, the illustrative difference is:"}</p><div className="result-number" style={{fontSize:37}}>{potential} <small>{ar?"لتر يوميًا (تقديري)":"liters/day (estimated)"}</small></div><p className="muted small">{ar?"ده مثال حسابي، مش وفر مياه تم قياسه.":"This is an estimate, not measured water savings."}</p></div>
 </section>;
}
const leakItems=[
 {id:"tap",ar:"اتأكد إن الصنابير مش بتنقط بعد القفل.",en:"Check that taps do not drip when fully closed."},
 {id:"toilet",ar:"راقب أي صوت تسريب أو جريان مستمر في خزان المرحاض.",en:"Listen for running or leaking water in the toilet cistern."},
 {id:"pipes",ar:"افحص الحنفيات والوصلات الظاهرة بحثًا عن بلل غير معتاد.",en:"Check accessible pipes and fittings for unusual moisture."},
 {id:"meter",ar:"لو عندك عداد منفصل، راقب تغيّر القراءة مع إغلاق كل الاستخدامات المائية.",en:"If you have a dedicated meter, compare readings when all fixtures are off."}
];

export function LeakChecklist({lang}:{lang:Lang}){
 const ar=lang==="ar",p=useProgress(),checked=p.checked||[];
 const toggle=(id:string)=>saveProgress({checked:checked.includes(id)?checked.filter(x=>x!==id):[...checked,id]});
 return <div className="panel" id="leaks"><span className="tag"><ClipboardCheck size={14}/>{ar?"فحص المنزل":"Home check"}</span><h2 style={{marginTop:14}}>{ar?"فحص التسريبات خطوة بخطوة":"Check for leaks step by step"}</h2><p className="muted small">{ar?"كل علامة بتساعدك تتابع الفحص، لكنها مش دليل إن التسريب اتصلّح.":"Track your checks here; completed checks do not prove a repair."}</p>
 {leakItems.map(item=><label key={item.id} className="check-row"><input type="checkbox" checked={checked.includes(item.id)} onChange={()=>toggle(item.id)}/><span>{ar?item.ar:item.en}</span></label>)}
 <div style={{marginTop:19}}><div className="progress-rail"><div className="progress-fill" style={{width:checked.length*25+"%"}}/></div><p className="muted small" style={{marginTop:8}}>{checked.length}/4 {ar?"خطوات مكتملة":"checks completed"}</p></div>
 <div className="notice warning">{ar?"لو لاحظت تسريب، تواصل مع فني مؤهل.":"If you notice a leak, consult a qualified professional."}</div></div>;
}
const questions=[
 {ar:"أيّ من التالي يعتبر قياسًا مؤكدًا للاستهلاك؟",en:"Which is verified consumption data?",optsAr:["نتيجة حاسبة تقريبية","قراءة عداد موثوقة","وعد بتقليل الاستخدام"],optsEn:["A rough calculator result","A reliable water meter reading","A promise to conserve"],answer:1},
 {ar:"إيه التصرف الأنسب عند وجود صنبور بيسرب؟",en:"What is the best response to a leaking tap?",optsAr:["تجاهله","إبلاغ المسؤول أو إصلاحه بأمان","فتح الماء أكثر"],optsEn:["Ignore it","Report it or arrange a safe repair","Turn water on higher"],answer:1},
 {ar:"الاختبار التعليمي بيقيس إيه؟",en:"What does a learning quiz measure?",optsAr:["فهم المعلومات","مياه موفرة باللتر","قراءة العداد"],optsEn:["Knowledge acquisition","Liters actually saved","Water meter readings"],answer:0},
 {ar:"هل تقليل النظافة الضرورية وسيلة مناسبة للترشيد؟",en:"Is reducing necessary hygiene a suitable conservation strategy?",optsAr:["نعم","لا","دائمًا"],optsEn:["Yes","No","Always"],answer:1},
 {ar:"حاسبة تعتمد على بيانات تدخلها بنفسك تعتبر:",en:"A calculator based on self-entered habits provides:",optsAr:["قياسًا مباشرًا","تقديرًا يعتمد على الافتراضات","قراءة من شركة المياه"],optsEn:["Direct measurement","An assumption-based estimate","A utility meter reading"],answer:1}
];

export function QuizWidget({lang}:{lang:Lang}){
 const ar=lang==="ar",p=useProgress();
 const [mode,setMode]=useState<"pre"|"post">("pre"),[answers,setAnswers]=useState<Record<number,number>>({}),[score,setScore]=useState<number|null>(null);
 const switchMode=(m:"pre"|"post")=>{setMode(m);setAnswers({});setScore(null);};
 const answered=Object.keys(answers).length;
 const submit=()=>{if(answered!==questions.length)return;const next=questions.filter((q,i)=>answers[i]===q.answer).length;setScore(next);saveProgress({[mode]:next});};
 return <div className="quiz-experience">
  <div className="quiz-topline"><div><span className="tag"><BookOpen size={15}/>{ar?"اختبر معلوماتك":"Knowledge check"}</span><h2>{ar?"خطوتين لقياس تطوّرك":"Two steps to see your progress"}</h2><p className="muted">{ar?"جاوب الأول قبل ما تتعلّم، وارجع للاختبار البعدي علشان تقارن نتيجتك.":"Take the first quiz, learn something new, then compare your score in the follow-up quiz."}</p></div></div>
  <div className="quiz-mode-grid" role="group" aria-label={ar?"اختيار الاختبار":"Choose a quiz"}>
   {(["pre","post"] as const).map((m,i)=>{const active=mode===m;const previous=p[m];return <button type="button" key={m} className={"quiz-mode-card"+(active?" is-active":"")} onClick={()=>switchMode(m)} aria-pressed={active}>
    <span className="quiz-mode-icon">{m==="pre"?<BookOpen size={25}/>:<Trophy size={25}/>}</span>
    <span className="quiz-mode-content"><small>{ar?"المرحلة "+(i+1):"STEP "+(i+1)}</small><strong>{m==="pre"?(ar?"الاختبار القبلي":"Before learning"):(ar?"الاختبار البعدي":"After learning")}</strong><span>{m==="pre"?(ar?"اكتشف مستوى معلوماتك الحالي":"See what you know today"):(ar?"شوف اتعلمت إيه":"See what you have learned")}</span><em>{previous===undefined?(ar?"ابدأ الاختبار":"Start quiz"):(ar?"آخر نتيجة: ":"Last score: ")+previous+"/5"} {active?"●":"→"}</em></span>
   </button>})}
  </div>
  <div className="panel quiz-main">
   <div className="quiz-session-head"><div><span className="tag">{mode==="pre"?(ar?"الاختبار القبلي":"Pre-quiz"):(ar?"الاختبار البعدي":"Post-quiz")}</span><h3>{ar?"جاهز تجاوب على 5 أسئلة؟":"Ready for 5 questions?"}</h3></div><strong>{answered} / {questions.length}</strong></div>
   <div className="progress-rail" aria-label={ar?"تقدم الاختبار":"Quiz completion"}><div className="progress-fill" style={{width:answered/questions.length*100+"%"}}/></div>
   <div className="quiz-question-grid">{questions.map((q,i)=><fieldset key={i} className="quiz-question"><legend><span>{String(i+1).padStart(2,"0")}</span>{ar?q.ar:q.en}</legend><div className="quiz-option-list">{(ar?q.optsAr:q.optsEn).map((opt,j)=><label className="option" key={j}><input type="radio" name={"q-"+i+"-"+mode} checked={answers[i]===j} onChange={()=>{setAnswers(prev=>({...prev,[i]:j}));setScore(null);}}/><span>{opt}</span></label>)}</div></fieldset>)}</div>
   <div className="quiz-actions"><button type="button" className="btn btn-primary" disabled={answered!==questions.length} onClick={submit}><CheckCircle2 size={17}/>{ar?"اعرض نتيجتي":"Show my score"}</button>{score!==null&&<div className="quiz-score" role="status"><PartyPopper size={22}/><strong>{score}/5</strong><span>{ar?"نتيجة الاختبار اتحفظت في حسابك":"Your quiz score has been saved"}</span></div>}</div>
  </div>
  <p className="muted small">{ar?"النتيجة بتوضح معلوماتك عن الترشيد، ومش قياس مباشر لكمية المياه الموفرة.":"Quiz results reflect knowledge, not directly measured water savings."}</p>
 </div>;
}
const habits=[
 {id:"tap-off",icon:Droplets,ar:"اقفل الصنبور أثناء تنظيف الأسنان أو الحلاقة.",en:"Turn off the tap while brushing teeth or shaving."},
 {id:"shower",icon:ShieldCheck,ar:"اضبط توقيت الاستحمام بدون التأثير على النظافة الضرورية.",en:"Time your shower without compromising necessary hygiene."},
 {id:"leak",icon:ClipboardCheck,ar:"نفّذ فحص التسريبات وبلّغ عن أي مشكلة.",en:"Complete a leak inspection and report any problem."},
 {id:"full-load",icon:BarChart3,ar:"شغّل الغسالة لما الحمولة مناسبة بدل دورات غير ضرورية.",en:"Run an appropriate laundry load instead of unnecessary cycles."},
];

export function ChallengesWidget({lang}:{lang:Lang}){
 const ar=lang==="ar",p=useProgress(),completed=p.challenges||[];
 const [celebrate,setCelebrate]=useState<string|null>(null);
 const [portalHost,setPortalHost]=useState<Element|null>(null);
 useEffect(()=>{setPortalHost(document.querySelector(".site"));},[]);
 useEffect(()=>{if(!celebrate)return;
  const priorOverflow=document.body.style.overflow;document.body.style.overflow="hidden";
  const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setCelebrate(null);};window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=priorOverflow;window.removeEventListener("keydown",onKey)};},[celebrate]);
 const current=habits.find(h=>h.id===celebrate);
 const toggle=(id:string)=>{const wasCompleted=completed.includes(id);saveProgress({challenges:wasCompleted?completed.filter(x=>x!==id):[...completed,id]});if(!wasCompleted)setCelebrate(id);};
 return <div className="challenge-experience">
  <div className="challenge-banner"><div className="challenge-banner-copy"><span><Sparkles size={17}/>{ar?"خلّي كل يوم أحسن":"Make every day count"}</span><h2>{ar?"كل عادة صغيرة إنجاز يستحق الاحتفال":"Small habits. Big reasons to celebrate."}</h2><p>{ar?"اختار تحديات مناسبة ليك، وسجّل اللي عملته.":"Choose a challenge, try it, and celebrate your progress."}</p></div><div className="challenge-badge"><Trophy size={34}/><strong>{completed.length}<small> / 4</small></strong><span>{ar?"إنجازات":"Achievements"}</span></div></div>
  <div className="challenge-section-title"><div><span className="tag"><Target size={15}/>{ar?"تحدياتك اليومية":"Your daily challenges"}</span><h2>{ar?"ابدأ بعادة واحدة":"Start with one habit"}</h2></div><span>{completed.length}/4 {ar?"تمت":"completed"}</span></div>
  <div className="challenge-grid">{habits.map((h,i)=>{const done=completed.includes(h.id);return <article className={"habit-card"+(done?" is-done":"")} key={h.id}>
    <div className="habit-top"><span className="habit-num">{String(i+1).padStart(2,"0")}</span><span className="habit-icon"><h.icon size={26}/></span></div>
    <h3>{ar?h.ar:h.en}</h3><p>{ar?"جرّب العادة بنفسك، وسجّل إنجازك لما تخلص.":"Try it yourself, then mark your progress."}</p>
    <button type="button" className={"habit-button"+(done?" done":"")} onClick={()=>toggle(h.id)}>{done?<><CheckCircle2 size={19}/>{ar?"اكتمل — تعديل":"Completed — undo"}</>:<>{ar?"أنجزت التحدي!":"I did it!"}<ArrowRight size={18}/></>}</button>
   </article>;})}</div>
  <div className="challenge-tip"><ShieldCheck size={19}/>{ar?"الإنجازات دي بتعتمد على تسجيلك الشخصي، مش قياس فعلي لكمية المياه.":"These milestones are based on your own check-ins, not metered water savings."}</div>
  {current&&portalHost&&createPortal(<div className="celebration-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setCelebrate(null);}}>
   <div className="confetti-field" aria-hidden="true">{Array.from({length:44},(_,i)=><span className="confetti-piece" key={i} style={{left:(i*37%94+3)+"%",animationDelay:((i%8)*0.065)+"s",animationDuration:(1.9+(i%6)*0.21)+"s",backgroundColor:["#20b8c4","#ffd05a","#fa809d","#5b9fef","#84d6a3","#b7a1ee"][i%6],["--drift" as string]:((i*43%220)-110)+"px"} as CSSProperties}/>)}</div>
   <div role="dialog" aria-modal="true" aria-labelledby="celebration-title" aria-describedby="celebration-desc" className="celebration-dialog">
    <button type="button" className="celebration-close" aria-label={ar?"إغلاق":"Close"} onClick={()=>setCelebrate(null)}><X size={21}/></button>
    <span className="celebration-icon"><Trophy size={42}/></span><span className="celebration-eyebrow"><Sparkles size={15}/>{ar?"إنجاز جديد!":"New achievement!"}</span>
    <h2 id="celebration-title">{ar?"برافو عليك! 🎉":"You did it! 🎉"}</h2><p id="celebration-desc">{ar?current.ar:current.en}</p><div className="celebration-total"><CheckCircle2 size={18}/>{completed.length} / 4 {ar?"تحديات أنجزتها":"challenges completed"}</div>
    <button type="button" className="btn btn-primary" onClick={()=>setCelebrate(null)}>{ar?"يلا نكمل":"Keep going"}<ArrowLeft size={18}/></button>
   </div>
  </div>,portalHost)}
 </div>;
}
export function ProgressWidget({lang}:{lang:Lang}){
 const ar=lang==="ar",p=useProgress();const checked=p.checked?.length||0,done=p.challenges?.length||0;
 const metrics=[{label:ar?"تحديات مكتملة":"Completed challenges",value:done+"/4",icon:Trophy},{label:ar?"خطوات فحص التسريبات":"Leak checks completed",value:checked+"/4",icon:ClipboardCheck},{label:ar?"آخر تقدير يومي":"Last daily estimate",value:p.estimate===undefined?"—":p.estimate.toLocaleString(ar?"ar-EG":"en-US")+" L",icon:Droplets}];
 return <div className="account-progress">
  <div className="account-section-title"><div><span className="tag"><Trophy size={15}/>{ar?"إنجازاتي":"My achievements"}</span><h2>{ar?"شايف نفسك وصلت لفين؟":"See how far you've come"}</h2></div><Link href={"/"+lang+"/challenges"} className="text-link">{ar?"كل التحديات":"All challenges"}<ArrowRight size={16}/></Link></div>
  <div className="metric-grid">{metrics.map(m=><div key={m.label} className="metric-card"><m.icon size={23}/><strong style={{fontSize:m.value.length>7?25:37}}>{m.value}</strong><span>{m.label}</span></div>)}</div>
  <div className="panel account-knowledge"><div className="account-knowledge-top"><div><span className="tag"><BookOpen size={16}/>{ar?"مستوى المعلومات":"Your learning"}</span><h2>{ar?"نتائج الاختبارات":"Your quiz results"}</h2></div><Link href={"/"+lang+"/learn"} className="btn btn-secondary">{ar?"تعلّم واختبر":"Learn & quiz"}<ArrowRight size={17}/></Link></div>
   <div className="knowledge-results"><div className="knowledge-result"><span>{ar?"الاختبار القبلي":"Before learning"}</span><strong>{p.pre===undefined?"—":p.pre+"/5"}</strong></div><div className="knowledge-result"><span>{ar?"الاختبار البعدي":"After learning"}</span><strong>{p.post===undefined?"—":p.post+"/5"}</strong></div></div>
   <p className="muted small">{ar?"الدرجات بتعكس نتيجة الأسئلة التعليمية، مش كمية المياه اللي اتوفرت.":"Scores show quiz knowledge, not measured water savings."}</p>
  </div>
 </div>;
}

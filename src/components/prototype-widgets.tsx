"use client";
import {useEffect,useState} from "react";
import {Droplets, CheckCircle2, BookOpen, Trophy, ArrowRight, ShieldAlert, BarChart3, ClipboardCheck, PartyPopper, Save, ShieldCheck, RotateCcw} from "lucide-react";
import {Lang,t} from "@/lib/content";

import {saveProgress,useProgress} from "@/lib/progress-cloud";
import {useAuth} from "@/components/auth-provider";

export function WaterCalculator({lang}:{lang:Lang}){
 const ar=lang==="ar";const [people,setPeople]=useState(3),[shower,setShower]=useState(8),[tap,setTap]=useState(3),[laundry,setLaundry]=useState(4),[saved,setSaved]=useState(false);
 // Assumptions for classroom demonstration, not measured household flow rates.
 const daily=Math.round(people*(shower*9+tap*6)+laundry*65/7);
 const potential=Math.round(people*(Math.min(1,shower)*9+Math.min(1,tap)*6));
 return <section className="stack"><div className="panel"><span className="tag"><Droplets size={14}/>{ar?"تقدير توضيحي":"Illustrative estimate"}</span><h2 style={{marginTop:16}}>{ar?"احسب الأنشطة اليومية":"Estimate your daily activities"}</h2><p className="muted small">{ar?"الحساب بيغطي الدش، الصنبور والغسيل فقط، ومش إجمالي استهلاك البيت.":"Covers showers, taps and laundry only; not your household's total water usage."}</p>
 <div className="form-grid" style={{marginTop:25}}>
 <div className="field"><label>{ar?"عدد الأشخاص في المنزل":"People in household"} <span className="value">{people}</span></label><input aria-label="Household size" type="range" min="1" max="12" value={people} onChange={e=>setPeople(Number(e.target.value))}/></div>
 <div className="field"><label>{ar?"دقائق الاستحمام للفرد يوميًا":"Shower minutes per person per day"} <span className="value">{shower}</span></label><input aria-label="Shower minutes" type="range" min="0" max="30" value={shower} onChange={e=>setShower(Number(e.target.value))}/></div>
 <div className="field"><label>{ar?"دقائق فتح الصنبور للفرد يوميًا":"Tap-running minutes per person per day"} <span className="value">{tap}</span></label><input aria-label="Tap minutes" type="range" min="0" max="30" value={tap} onChange={e=>setTap(Number(e.target.value))}/></div>
 <div className="field"><label>{ar?"عدد مرات الغسيل أسبوعيًا":"Laundry loads per week"} <span className="value">{laundry}</span></label><input aria-label="Laundry loads" type="range" min="0" max="21" value={laundry} onChange={e=>setLaundry(Number(e.target.value))}/></div></div>
 <div className="divider"/><p className="muted small">{ar?"تقدير الأنشطة المحددة يوميًا":"Daily estimate for selected activities"}</p><div className="result-number">{daily.toLocaleString(lang==="ar"?"ar-EG":"en-US")} <small>{ar?"لتر/يوم":"L/day"}</small></div>
 <div className="notice"><ShieldAlert size={16} style={{verticalAlign:"middle",marginInlineEnd:7}}/>{ar?"الافتراضات: الدش 9 لتر/دقيقة، الصنبور 6 لتر/دقيقة، دورة الغسيل 65 لتر. قيم نموذجية للشرح وليست قياسات لأجهزتك.":"Assumptions: shower 9 L/min, running tap 6 L/min, laundry 65 L/load. Demonstration inputs, NOT measured appliance data."}</div>
 <div className="action-row"><button className="btn btn-primary" onClick={()=>{saveProgress({estimate:daily});setSaved(true)}}><Save size={17}/>{ar?"احفظ تقديري على الجهاز":"Save estimate on this device"}</button>{saved&&<span className="tag"><CheckCircle2 size={13}/>{ar?"اتحفظ محليًا":"Saved locally"}</span>}</div></div>
 <div className="panel"><h3>{ar?"سيناريو اختياري — وليس وفرًا مثبتًا":"Optional scenario — not verified savings"}</h3><p className="muted">{ar?"لو كل فرد قلّل دقيقة واحدة من الدش ودقيقة من فتح الصنبور يوميًا، النموذج يتوقع فرق حوالي:":"If each person reduces one shower minute and one running-tap minute daily, this model estimates a difference of:"}</p><div className="result-number" style={{fontSize:37}}>{potential} <small>{ar?"لتر/يوم (افتراضي)":"L/day (hypothetical)"}</small></div><div className="notice warning">{ar?"ده فرق محسوب من الافتراضات السابقة، مش مياه موفَّرة تم قياسها.":"This is a difference calculated from assumptions; no actual water saving has been measured."}</div></div></section>;
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
 return <div className="panel" id="leaks"><span className="tag"><ClipboardCheck size={14}/>{ar?"فحص منزلي":"Home inspection"}</span><h2 style={{marginTop:14}}>{ar?"قائمة فحص التسريبات":"Leak checklist"}</h2><p className="muted small">{ar?"إكمال الفحص لا يثبت إصلاح التسريب أو توفير مياه.":"Completing checks does not verify leak repair or water savings."}</p>
 {leakItems.map(item=><label key={item.id} className="check-row"><input type="checkbox" checked={checked.includes(item.id)} onChange={()=>toggle(item.id)}/><span>{ar?item.ar:item.en}</span></label>)}
 <div style={{marginTop:19}}><div className="progress-rail"><div className="progress-fill" style={{width:checked.length*25+"%"}}/></div><p className="muted small" style={{marginTop:8}}>{checked.length}/4 {ar?"خطوات مكتملة":"checks completed"}</p></div>
 <div className="notice warning">{ar?"لو في تسريب أو شبهة تلوث، استعن بفني مؤهل. لا تستخدم مياه رمادية بدون معالجة وموافقة مناسبة.":"For leaks or suspected contamination, consult a qualified professional. Do not reuse greywater without appropriate treatment and safeguards."}</div></div>;
}

const questions=[
 {ar:"أيّ من التالي يعتبر قياسًا مؤكدًا للاستهلاك؟",en:"Which is verified consumption data?",optsAr:["نتيجة حاسبة تقريبية","قراءة عداد موثوقة","وعد بتقليل الاستخدام"],optsEn:["A rough calculator result","A reliable water meter reading","A promise to conserve"],answer:1},
 {ar:"إيه التصرف الأنسب عند وجود صنبور بيسرب؟",en:"What is the best response to a leaking tap?",optsAr:["تجاهله","إبلاغ المسؤول أو إصلاحه بأمان","فتح الماء أكثر"],optsEn:["Ignore it","Report it or arrange a safe repair","Turn water on higher"],answer:1},
 {ar:"الاختبار التعليمي بيقيس إيه؟",en:"What does a learning quiz measure?",optsAr:["فهم المعلومات","مياه موفرة باللتر","قراءة العداد"],optsEn:["Knowledge acquisition","Liters actually saved","Water meter readings"],answer:0},
 {ar:"هل تقليل النظافة الضرورية وسيلة مناسبة للترشيد؟",en:"Is reducing necessary hygiene a suitable conservation strategy?",optsAr:["نعم","لا","دائمًا"],optsEn:["Yes","No","Always"],answer:1},
 {ar:"حاسبة تعتمد على بيانات تدخلها بنفسك تعتبر:",en:"A calculator based on self-entered habits provides:",optsAr:["قياسًا مباشرًا","تقديرًا يعتمد على الافتراضات","قراءة من شركة المياه"],optsEn:["Direct measurement","An assumption-based estimate","A utility meter reading"],answer:1}
];
export function QuizWidget({lang}:{lang:Lang}){
 const ar=lang==="ar";const [mode,setMode]=useState<"pre"|"post">("pre"),[answers,setAnswers]=useState<Record<number,number>>({}),[score,setScore]=useState<number|null>(null);const p=useProgress();
 const switchMode=(m:"pre"|"post")=>{setMode(m);setAnswers({});setScore(null)};
 const submit=()=>{if(Object.keys(answers).length!==questions.length)return;const n=questions.filter((q,i)=>answers[i]===q.answer).length;setScore(n);saveProgress({[mode]:n})};
 return <div className="panel"><div className="tabbar"><button className={"tab "+(mode==="pre"?"selected":"")} onClick={()=>switchMode("pre")}>{ar?"الاختبار القبلي":"Pre-quiz"}</button><button className={"tab "+(mode==="post"?"selected":"")} onClick={()=>switchMode("post")}>{ar?"الاختبار البعدي":"Post-quiz"}</button></div>
 <p className="muted small">{ar?"5 أسئلة. النتيجة تقيس المعرفة مش الاستهلاك.":"Five questions. Scores measure knowledge, not actual water usage."}</p>
 {questions.map((q,i)=><div key={i} className="quiz-question"><h3>{i+1}. {ar?q.ar:q.en}</h3>{(ar?q.optsAr:q.optsEn).map((opt,j)=><label className="option" key={j}><input type="radio" name={"q-"+i+"-"+mode} checked={answers[i]===j} onChange={()=>{setAnswers(prev=>({...prev,[i]:j}));setScore(null)}}/>{opt}</label>)}</div>)}
 <div className="action-row"><button className="btn btn-primary" disabled={Object.keys(answers).length!==5} onClick={submit}><CheckCircle2 size={17}/>{ar?"اعرض النتيجة":"See results"}</button>{score!==null&&<span className="tag"><PartyPopper size={15}/>{score}/5 — {ar?"نتيجة معرفية":"Knowledge score"}</span>}{p[mode]!==undefined&&<span className="muted small">{ar?"آخر نتيجة محفوظة:":"Last saved:"} {p[mode]}/5</span>}</div></div>;
}
const habits=[
 {id:"tap-off",icon:Droplets,ar:"اقفل الصنبور أثناء تنظيف الأسنان أو الحلاقة.",en:"Turn off the tap while brushing teeth or shaving."},
 {id:"shower",icon:ShieldCheck,ar:"اضبط توقيت الاستحمام بدون التأثير على النظافة الضرورية.",en:"Time your shower without compromising necessary hygiene."},
 {id:"leak",icon:ClipboardCheck,ar:"نفّذ فحص التسريبات وبلّغ عن أي مشكلة.",en:"Complete a leak inspection and report any problem."},
 {id:"full-load",icon:BarChart3,ar:"شغّل الغسالة لما الحمولة مناسبة بدل دورات غير ضرورية.",en:"Run an appropriate laundry load instead of unnecessary cycles."},
];
export function ChallengesWidget({lang}:{lang:Lang}){
 const ar=lang==="ar",p=useProgress(),completed=p.challenges||[];return <div className="stack">{habits.map(h=><div className="challenge-card" key={h.id}><div className="round-icon"><h.icon size={23}/></div><div className="challenge-body"><h3>{ar?h.ar:h.en}</h3><p>{ar?"سجّل تنفيذك ذاتيًا. ده مش إثبات لترات مياه وفّرتها.":"Log your action yourself. This is not proof of saved liters."}</p></div><button className={"btn "+(completed.includes(h.id)?"btn-secondary":"btn-primary")} onClick={()=>saveProgress({challenges:completed.includes(h.id)?completed.filter(x=>x!==h.id):[...completed,h.id]})}>{completed.includes(h.id)?<><CheckCircle2 size={16}/>{ar?"تم":"Done"}</>:<>{ar?"سجّل الإنجاز":"Mark done"}<ArrowRight size={16}/></>}</button></div>)}<div className="notice"><Trophy size={15}/> {ar?"الإنجازات المتسجلة هنا ذاتية ومتخزنة على جهازك فقط في المرحلة دي.":"Completed activities are self-reported and stored on your device only at this stage."}</div></div>;
}
export function ProgressWidget({lang}:{lang:Lang}){
 const ar=lang==="ar",p=useProgress();const {profile}=useAuth();const checked=p.checked?.length||0,done=p.challenges?.length||0;
 const metrics=[{label:ar?"التحديات المكتملة":"Completed challenges",value:done+"/4",icon:Trophy},{label:ar?"فحوص التسريب":"Leak checks",value:checked+"/4",icon:ClipboardCheck},{label:ar?"آخر تقدير":"Latest estimate",value:p.estimate===undefined?"—":p.estimate+" L/d",icon:Droplets}];
 return <div className="stack"><div className="metric-grid">{metrics.map(m=><div key={m.label} className="metric-card"><m.icon size={22}/><strong style={{fontSize:m.value.length>6?23:35}}>{m.value}</strong><span>{m.label}</span></div>)}</div>
 <div className="panel"><h2><BookOpen size={22} style={{verticalAlign:"middle",marginInlineEnd:8}}/>{ar?"تطور المعرفة":"Knowledge progress"}</h2><div className="metric-grid" style={{marginTop:20,gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}><div className="metric-card"><span>{ar?"اختبار قبلي":"Pre-quiz"}</span><strong>{p.pre===undefined?"—":p.pre+"/5"}</strong></div><div className="metric-card"><span>{ar?"اختبار بعدي":"Post-quiz"}</span><strong>{p.post===undefined?"—":p.post+"/5"}</strong></div></div><p className="muted small" style={{marginTop:19}}>{ar?"الفرق بين الدرجتين يعكس تغيرًا محتملًا في نتيجة الاختبار فقط، مش إثبات تغير سلوك أو استهلاك.":"A score difference may reflect learning on this quiz only; it does not establish behavior change or measured conservation."}</p></div>
 <div className="notice warning"><ShieldAlert size={16}/> {ar?"النتائج تُحفظ محليًا؛ وعند تسجيل الدخول ووجود ملف شخصي يتم مزامنتها إلى Firestore. التقديرات ليست وفورات مقاسة.":"Activity is saved locally, and synchronized to Firestore when signed in with a completed profile. Estimates are not verified water savings."}</div></div>;
}

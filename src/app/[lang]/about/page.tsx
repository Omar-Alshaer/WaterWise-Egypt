import Link from "next/link";
import {MascotCorner} from "@/components/mascot-corner";
import {AboutContextGuard} from "@/components/about-context-guard";
import {notFound} from "next/navigation";
import {existsSync} from "node:fs";
import path from "node:path";
import {BookOpenCheck,FileText,Leaf,Linkedin,Lightbulb,Target,Users,ArrowLeft,ArrowRight,ShieldCheck,Droplets,Sparkles} from "lucide-react";
import {isLang,team} from "@/lib/content";

export default async function AboutPage({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();
 const ar=lang==="ar",Arrow=ar?ArrowLeft:ArrowRight;
 const reportAvailable=existsSync(path.join(process.cwd(),"public","project","WaterWise-Egypt-Research.pdf"));
 const sections=[
  {Icon:Lightbulb,title:ar?"الوعي":"Awareness",body:ar?"نحوّل المعلومات والأبحاث عن المياه لأفكار بسيطة ممكن تطبّقها يوميًا.":"Turning water research into ideas people can use every day."},
  {Icon:Target,title:ar?"التجربة":"Practice",body:ar?"حاسبة مبسطة وتحديات وفحص للتسريبات يشجعوك تبدأ بخطوات صغيرة.":"A friendly calculator, challenges and leak checks to help you get started."},
  {Icon:BookOpenCheck,title:ar?"التعلّم":"Learning",body:ar?"اختبار قبل التعلّم وبعده علشان تشوف تطور معلوماتك بدون مبالغة في النتائج.":"Before-and-after quizzes to see what you learned without overstating the impact."},
 ];
 return <div className="ww-about"><AboutContextGuard/>
  <section className="ww-about-hero"><MascotCorner pose="welcome" className="ww-about-hero-character"/>
   <div className="container ww-about-hero-inner">
    <div className="ww-about-hero-copy" data-reveal>
     <span className="ww-about-eyebrow"><Sparkles size={16}/>{ar?"قصة WATERWISE":"THE WATERWISE STORY"}</span>
     <h1>{ar?"عن الفكرة، والناس اللي وراها.":"The idea. The people. The purpose."}</h1>
     <p>{ar?"WaterWise Egypt مشروع طلابي من جامعة العلمين الدولية، هدفه يخلي ترشيد المياه أسهل في الفهم والتجربة. من معلومة صغيرة لعادة يومية، ومن الوعي للفعل.":"WaterWise Egypt is a student project from Alamein International University. We make water conservation easier to understand and practice, taking everyday habits from awareness to action."}</p>
     <div className="ww-about-hero-actions"><a href="#our-team" className="btn btn-light">{ar?"تعرّف على الفريق":"Meet the team"}<Arrow size={18}/></a><a href="#project-report" className="ww-about-text-link">{ar?"ملف البحث":"Research report"}<FileText size={17}/></a></div>
    </div>
    <div className="ww-about-emblem" aria-hidden="true"><Droplets size={100} strokeWidth={1.1}/><span>SDG <b>06</b></span></div>
   </div>
  </section>
  <div className="container ww-about-body">
   <section className="ww-about-overview" data-reveal>
    <div className="ww-about-title"><span className="ww-section-label"><Leaf size={17}/>{ar?"ليه WaterWise؟":"WHY WATERWISE?"}</span><h2>{ar?"مش بس نتكلم عن المياه، نبدأ نتصرف.":"Beyond awareness. Toward action."}</h2><p>{ar?"المشروع بيجمع بين المعرفة والأدوات التفاعلية، من غير ما يخلط بين التقديرات وقياسات استهلاك المياه الحقيقية.":"Our project connects knowledge with interactive tools, keeping estimates clearly separate from actual measured water use."}</p></div>
    <div className="ww-about-value-grid">{sections.map(({Icon,title,body},i)=><article className="ww-about-value" key={title} data-reveal><span className="ww-about-value-number">0{i+1}</span><div className="ww-about-value-icon"><Icon size={27}/></div><h3>{title}</h3><p>{body}</p></article>)}</div>
   </section>
   <section id="our-team" className="ww-about-team-section">
    <div className="ww-about-section-head" data-reveal><div><span className="ww-section-label"><Users size={17}/>{ar?"فريق العمل":"THE TEAM"}</span><h2>{ar?"خمسة أشخاص، هدف واحد.":"Five people. One purpose."}</h2><p>{ar?"فريق WaterWise Egypt من طلاب جامعة العلمين الدولية. بنجمع بين البحث، المحتوى، وتجربة استخدام مريحة.":"Alamein International University students bringing together research, content and an approachable website experience."}</p></div><span className="ww-team-count">05 <small>{ar?"أعضاء":"members"}</small></span></div>
    <div className="ww-people-grid">{team.map((member,i)=><article className={"ww-person-card"+(member.lead?" ww-person-lead":"")} key={member.id} data-reveal>
      <div className="ww-person-portrait">
       {member.image?<img src={member.image} alt={member.name} width={160} height={160}/>:<div className="ww-person-monogram" aria-label={ar?"صورة رمزية":"Initials avatar"}>{member.name.split(" ").slice(0,2).map(n=>n[0]).join("")}</div>}
       <span className="ww-person-index">0{i+1}</span>
      </div>
      <div className="ww-person-details">
       {member.lead&&<span className="ww-person-spotlight"><Sparkles size={13}/>{ar?"تطوير الموقع":"Website development"}</span>}
       <h3>{member.name}</h3>
       <p className="ww-person-role">{ar?member.roleAr:member.roleEn}</p>
       {member.linkedin?<a className="ww-person-linkedin" href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={"LinkedIn — "+member.name}><Linkedin size={17}/> LinkedIn <Arrow size={15}/></a>:<span className="ww-person-nolink">{ar?"عضو في فريق WaterWise":"WaterWise team member"}</span>}
      </div>
    </article>)}</div>
   </section>
   <section id="project-report" className="ww-report-section" data-reveal><MascotCorner pose="protecting-water" className="ww-report-character"/>
    <div className="ww-about-section-head"><div><span className="ww-section-label"><FileText size={17}/>{ar?"توثيق المشروع":"PROJECT DOCUMENTATION"}</span><h2>{ar?"ملف البحث النهائي":"Final research report"}</h2><p>{ar?"النسخة الأكاديمية من مشروع WaterWise Egypt متاحة للقراءة مباشرة داخل الموقع.":"The academic WaterWise Egypt report is available to read directly here on the website."}</p></div></div>
    <div className="ww-report-card">
     <div className="ww-report-topbar"><span><FileText size={19}/>{ar?"WaterWise Egypt — تقرير المشروع":"WaterWise Egypt — Project report"}</span><span className="ww-report-status">{reportAvailable?(ar?"الملف متاح للقراءة":"Available to read"):(ar?"قيد الإعداد":"In preparation")}</span></div>
     {reportAvailable?
      <iframe title={ar?"قراءة التقرير البحثي داخل الموقع":"Read the research report on this website"} src="/project/WaterWise-Egypt-Research.pdf#toolbar=0&navpanes=0&scrollbar=0" className="ww-report-frame" loading="lazy"/>:
      <div className="ww-report-empty"><span className="ww-report-document"><FileText size={55}/></span><h3>{ar?"مكان التقرير جاهز":"The report space is ready"}</h3><p>{ar?"بعد اعتماد النسخة النهائية، هتقدر تتصفح صفحات البحث هنا من غير ما تغادر الموقع.":"Once the final report is approved, you will be able to browse its pages here without leaving the website."}</p></div>}
    </div>
    <p className="ww-report-note"><ShieldCheck size={15}/>{ar?"عارض الملف مصمم للقراءة داخل الصفحة؛ إمكانية حفظ نسخة من المتصفح قد تختلف حسب الجهاز.":"The report viewer is designed for in-page reading; browser save options may vary by device."}</p>
   </section>
  </div>
 </div>;
}

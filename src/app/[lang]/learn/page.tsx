import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {QuizWidget} from "@/components/prototype-widgets";
import {BookOpen,ShieldCheck,Droplets,Lightbulb} from "lucide-react";
export default async function Learn({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 const lessons=[
  {Icon:Droplets,title:ar?"وفّر المياه من غير ما تقلل النظافة":"Save water without cutting hygiene",copy:ar?"اقفل الحنفية وقت عدم استخدامها، وخلّي وقت الدش مناسب، وقلّل دورات الغسيل غير الضرورية. الشرب وغسل الإيدين والنظافة الأساسية أولويات دايمًا.":"Close unused taps, keep showers sensible and avoid unnecessary laundry cycles. Drinking water, handwashing and essential hygiene always come first."},
  {Icon:ShieldCheck,title:ar?"كل تسريب يستحق المراجعة":"Every leak deserves attention",copy:ar?"راقب التنقيط والصوت المستمر، واطلب مساعدة فني لو لاحظت مشكلة. الفحص أول خطوة، والإصلاح هو اللي يوقف التسريب.":"Look for drips or running water and ask a professional when needed. Checking is a first step; fixing the leak is what stops it."},
  {Icon:BookOpen,title:ar?"افهم الفرق بين التقدير والقياس":"Know estimates from actual readings",copy:ar?"الحاسبة بتديك تقدير تقريبي، والاختبار بيقيس معلوماتك. علشان تعرف الاستخدام الحقيقي، محتاج قراءة عداد موثوقة.":"A calculator gives an estimate and a quiz checks knowledge. Reliable meter readings are needed to measure actual use."}
 ];
 return <><PageHero lang={lang} kicker={ar?"اتعلّم وطبّق":"LEARN & GROW"} title={ar?"تعلّم واختبر معلوماتك":"Learn and test your knowledge"} description={ar?"معلومات مفيدة في دقائق، وبعدها اختبر نفسك قبل التعلّم وبعده وشوف الفرق.":"Explore practical water-saving ideas, then compare your knowledge before and after learning."}/>
 <div className="container page-content learn-experience">
  <section aria-labelledby="learn-lessons-title"><div className="learn-section-title"><span className="tag"><Lightbulb size={16}/>{ar?"اعرف أكتر":"QUICK LESSONS"}</span><h2 id="learn-lessons-title">{ar?"3 أفكار تستاهل تعرفها":"Three ideas worth knowing"}</h2><p>{ar?"خطوات واقعية تقدر تبدأ بيها في البيت.":"Practical habits you can start at home."}</p></div>
   <div className="learn-lesson-grid">{lessons.map(({Icon,title,copy},i)=><article className="learn-lesson-card" key={title}><span className="learn-lesson-num">{String(i+1).padStart(2,"0")}</span><div className="learn-lesson-icon"><Icon size={26}/></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>
  <section className="learn-quiz-section" aria-label={ar?"الاختبارات":"Quizzes"}><QuizWidget lang={lang}/></section>
 </div></>;
}

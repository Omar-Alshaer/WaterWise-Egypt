import Link from "next/link";
import Image from "next/image";
import {Droplet,ArrowUpRight,BookOpen,Calculator,ClipboardCheck,Trophy,ArrowRight,ArrowLeft,Waves,Leaf,ShieldCheck,Sparkles,MoveDown,Target,ChartNoAxesCombined,ArrowUp} from "lucide-react";
import {isLang,t} from "@/lib/content";
import {notFound} from "next/navigation";
export default async function Home({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();
 const tr=t[lang],ar=lang==="ar",Arrow=ar?ArrowLeft:ArrowRight;
 const cards=[
  {icon:Calculator,title:tr.c1,body:tr.c1d,href:"/tools",num:"01"},
  {icon:ClipboardCheck,title:tr.c2,body:tr.c2d,href:"/tools#leaks",num:"02"},
  {icon:BookOpen,title:tr.c3,body:tr.c3d,href:"/learn",num:"03"},
  {icon:Trophy,title:tr.c4,body:tr.c4d,href:"/challenges",num:"04"}
 ];
 return <>
 <section className="ww-hero" aria-labelledby="ww-hero-title">
  <div className="ww-hero-blur ww-hero-blur-one" aria-hidden="true"/>
  <div className="ww-hero-blur ww-hero-blur-two" aria-hidden="true"/>
  <div className="container ww-hero-layout">
   <div className="ww-hero-copy">
    <div className="ww-hero-eyebrow"><span className="ww-hero-eyebrow-icon"><Droplet size={15} fill="currentColor"/></span>{ar?"مبادرة طلابية من العلمين الدولية":"A student project from Alamein International University"}<span className="ww-hero-eyebrow-dot"/></div>
    <h1 id="ww-hero-title">{ar?<>كل نقطة مياه<span>تستاهل نحافظ عليها.</span></>:<>Every drop has <span>a story worth saving.</span></>}</h1>
    <p className="ww-hero-description">{ar?"خلّي ترشيد المياه جزء من يومك. افهم استخدامك، اختبر معلوماتك، وابدأ تحديات بسيطة تقدر تلتزم بيها فعلًا.":"Make smarter water habits part of everyday life. Understand your usage, challenge your knowledge and turn small actions into lasting routines."}</p>
    <div className="ww-hero-actions">
     <Link className="ww-hero-primary" href={"/"+lang+"/tools"}>{ar?"اكتشف استخدامك":"Explore your water use"}<Arrow size={20}/></Link>
     <Link className="ww-hero-secondary" href={"/"+lang+"/about"}>{ar?"اعرف قصة المشروع":"Our story"}<ArrowUpRight size={19}/></Link>
    </div>
    <div className="ww-hero-proof"><span><ShieldCheck size={17}/>{ar?"مبني على أبحاث علمية":"Research-informed"}</span><i/><span><Leaf size={17}/>{ar?"عادات آمنة وعملية":"Practical & safe habits"}</span></div>
   </div>
   <div className="ww-hero-visual" aria-hidden="true">
    <div className="ww-hero-rings ww-rings-one"/>
    <div className="ww-hero-rings ww-rings-two"/>
    <div className="ww-hero-orbit-dot dot-one"/>
    <div className="ww-hero-orbit-dot dot-two"/>
    <div className="ww-hero-water-sphere">
     <div className="ww-sphere-highlight"/>
     <Image src="/mascots/welcome.png" alt="" className="ww-sphere-drop ww-hero-mascot" width={330} height={330} priority/>
     <span className="ww-sphere-sparkle sparkle-a"><Sparkles size={24}/></span>
     <span className="ww-sphere-sparkle sparkle-b"><Sparkles size={17}/></span>
    </div>
    <div className="ww-hero-float ww-hero-float-top"><span className="ww-float-icon"><Waves size={24}/></span><div><small>{ar?"هدف التنمية المستدامة":"Sustainable development goal"}</small><strong>{ar?"المياه النظيفة — 06":"Clean Water — 06"}</strong></div></div>
    <div className="ww-hero-float ww-hero-float-bottom"><span className="ww-float-icon alt"><Target size={22}/></span><div><small>{ar?"من الوعي إلى الفعل":"From awareness to action"}</small><strong>{ar?"خطوة صغيرة كل يوم":"One small step a day"}</strong></div><ArrowUp size={17}/></div>
    <span className="ww-hero-scene-caption">WATERWISE / EGYPT</span>
   </div>
  </div>
  <div className="container ww-hero-bottom">
   <span className="ww-hero-scroll"><MoveDown size={18}/>{ar?"اكتشف أكثر":"Explore below"}</span>
   <div className="ww-hero-pillars"><span><BookOpen size={17}/>{ar?"اتعلّم":"Learn"}</span><span><ChartNoAxesCombined size={17}/>{ar?"افهم":"Understand"}</span><span><Trophy size={17}/>{ar?"أنجز":"Achieve"}</span></div>
  </div>
 </section>
 <section className="features section ww-home-features"><div className="container">
  <div className="section-head" data-reveal><div><span className="section-kicker"><Sparkles size={16}/>{ar?"ابدأ رحلتك":"THE WATERWISE EXPERIENCE"}</span><h2>{tr.featTitle}</h2><p>{tr.featBody}</p></div><div className="section-icon"><Leaf size={26}/></div></div>
  <div className="feature-grid">{cards.map(card=><Link href={"/"+lang+card.href} className="feature-card" key={card.num} data-reveal><span className="feature-no">{card.num}</span><span className="feature-icon"><card.icon size={26}/></span><h3>{card.title}</h3><p>{card.body}</p><span className="feature-link">{tr.common.learnMore}<Arrow size={18}/></span></Link>)}</div>
 </div></section>
 <section className="section ww-home-bridge"><div className="container"><div className="ww-home-bridge-inner" data-reveal><span className="ww-bridge-number">06</span><div><span className="ww-bridge-kicker">{ar?"الهدف السادس من أهداف التنمية المستدامة":"SUSTAINABLE DEVELOPMENT GOAL 06"}</span><h2>{ar?"مستقبل المياه يبدأ بعاداتنا النهارده.":"Tomorrow's water future starts with today's habits."}</h2><p>{ar?"شاركنا رحلة بسيطة للتعلّم والتجربة، وخلي كل اختيار واعي خطوة في الاتجاه الصح.":"Explore, learn and build thoughtful habits — one decision at a time."}</p></div><Link href={"/"+lang+"/challenges"} className="ww-bridge-action" aria-label={ar?"ابدأ التحديات":"Start challenges"}><Arrow size={28}/></Link></div></div></section>
 </>;
}

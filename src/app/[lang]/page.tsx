import Link from "next/link";
import {Droplet, ArrowUpRight, BookOpen, Calculator, ClipboardCheck, Trophy, ArrowRight, ArrowLeft, Waves, Leaf, BarChart3, ShieldCheck, Sparkles} from "lucide-react";
import {isLang,t} from "@/lib/content";
import {notFound} from "next/navigation";
export default async function Home({params}:{params:Promise<{lang:string}>}) {
 const {lang}=await params;if(!isLang(lang))notFound();const tr=t[lang];const Arrow=lang==="ar"?ArrowLeft:ArrowRight;
 const cards=[{icon:Calculator,title:tr.c1,body:tr.c1d,href:"/tools",num:"01"},{icon:ClipboardCheck,title:tr.c2,body:tr.c2d,href:"/tools#leaks",num:"02"},{icon:BookOpen,title:tr.c3,body:tr.c3d,href:"/learn",num:"03"},{icon:Trophy,title:tr.c4,body:tr.c4d,href:"/challenges",num:"04"}];
 return <><section className="hero"><div className="hero-glow"/><div className="container hero-grid">
  <div className="hero-content"><div className="eyebrow"><span className="status-dot"/>{tr.pill}</div><h1>{tr.hero1}<br/><span>{tr.hero2}</span></h1><p className="hero-body">{tr.heroBody}</p>
  <div className="hero-buttons"><Link href={"/"+lang+"/tools"} className="btn btn-primary">{tr.start}<Arrow size={19}/></Link><Link href={"/"+lang+"/challenges"} className="btn btn-outline">{tr.how}<ArrowUpRight size={18}/></Link></div>
  <div className="hero-trust"><ShieldCheck size={16}/> {tr.note}</div></div>
  <div className="hero-art" aria-hidden="true"><div className="circle circle-outer"/><div className="circle circle-inner"/><div className="big-droplet"><Droplet size={158} strokeWidth={1.4} fill="currentColor"/></div><div className="orbit-dot dot-a"/><div className="orbit-dot dot-b"/><div className="floating-badge badge-top"><Waves size={21}/><span>SDG <strong>6</strong></span></div><div className="floating-badge badge-bottom"><Leaf size={21}/><span>Save water<br/><strong>Start today</strong></span></div></div>
 </div><div className="container hero-stats"><div><strong>10</strong><span>{tr.stat1}</span></div><div><strong>02</strong><span>{tr.stat2}</span></div><div><strong>06</strong><span>{tr.stat3}</span></div></div></section>
 <section className="features section"><div className="container"><div className="section-head"><div><span className="section-kicker"><Sparkles size={16}/> WATERWISE EXPERIENCE</span><h2>{tr.featTitle}</h2><p>{tr.featBody}</p></div><div className="section-icon"><BarChart3 size={26}/></div></div>
 <div className="feature-grid">{cards.map(card=><Link href={"/"+lang+card.href} className="feature-card" key={card.num}><span className="feature-no">{card.num}</span><span className="feature-icon"><card.icon size={26}/></span><h3>{card.title}</h3><p>{card.body}</p><span className="feature-link">{tr.common.learnMore}<Arrow size={18}/></span></Link>)}</div></div></section>
 <section className="section bottom-cta"><div className="container"><div className="cta-box"><div className="cta-decor"><Droplet size={70}/></div><span className="section-kicker">{tr.tagline}</span><h2>{tr.ctaTitle}</h2><p>{tr.ctaBody}</p><Link href={"/"+lang+"/tools"} className="btn btn-light">{tr.ctaButton}<Arrow size={18}/></Link></div></div></section>
 </>;
}
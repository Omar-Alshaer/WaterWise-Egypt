"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";
import {Droplets,Menu,X,Languages,Waves,UserRound,Shield,ArrowLeft,ArrowRight,ArrowUpRight,Leaf,BookOpen,Target,Heart,FileText} from "lucide-react";
import {Lang,t} from "@/lib/content";
import {useAuth} from "./auth-provider";
import {ScrollReveal} from "./scroll-reveal";
export function SiteShell({lang,children}:{lang:Lang;children:React.ReactNode}){
 const [open,setOpen]=useState(false);
 const path=usePathname(),tr=t[lang],other=lang==="ar"?"en":"ar",ar=lang==="ar",Arrow=ar?ArrowLeft:ArrowRight;
 const {user,profile}=useAuth();
 const picture=user?.providerData.find(p=>p.providerId==="google.com")?.photoURL||user?.photoURL;
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=ar?"rtl":"ltr";},[lang,ar]);
 useEffect(()=>{setOpen(false);},[path]);
 const links=[["",tr.nav.home],["tools",tr.nav.tools],["learn",tr.nav.learn],["challenges",tr.nav.challenges],["dashboard",tr.nav.dashboard],["research",tr.nav.research],["about",tr.nav.team]] as const;
 return <div className="site" dir={ar?"rtl":"ltr"} lang={lang}>
  <ScrollReveal path={path}/>
  <div className="announcement"><Waves size={15}/><span>{ar?"المياه مورد مشترك، وكل عادة صغيرة ممكن تبدأ فرق.":"Water is a shared resource. Change starts with small habits."}</span></div>
  <header className="header"><div className="container navrow">
   <Link href={"/"+lang} className="brand"><span className="brand-icon"><Droplets size={27} strokeWidth={2.5}/></span><span className="brand-text"><strong>WaterWise <em>Egypt</em></strong><small>{tr.tagline}</small></span></Link>
   <nav id="primary-navigation" className={"navlinks"+(open?" open":"")} aria-label="Primary navigation">{links.map(([url,label])=><Link key={url} aria-current={path==="/"+lang+(url?"/"+url:"")?"page":undefined} onClick={()=>setOpen(false)} className={path==="/"+lang+(url?"/"+url:"")?"active":""} href={"/"+lang+(url?"/"+url:"")}>{label}</Link>)}</nav>
   <div className="nav-actions">
    <Link className="lang-switch" aria-label="Switch language" href={"/"+other+path.replace(/^\/(ar|en)/,"")}><Languages size={17}/>{tr.english}</Link>
    <Link className="login-link" href={"/"+lang+(user?"/dashboard":"/login")} aria-label={profile?profile.displayName:tr.nav.login}>{picture?<img className="nav-avatar" src={picture} referrerPolicy="no-referrer" alt=""/>:<UserRound size={17}/>}<span>{profile?profile.displayName.split(" ")[0]:tr.nav.login}</span></Link>
    <button className="menu-btn" type="button" aria-controls="primary-navigation" aria-expanded={open} aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
   </div></div></header>
  <main id="main-content">{children}</main>
  <footer className="footer ww-footer">
   <div className="ww-footer-glow" aria-hidden="true"/>
   <div className="container ww-footer-container">
    <div className="ww-footer-top" data-reveal>
     <div className="ww-footer-cta-copy"><span><Heart size={16}/>{ar?"كل نقطة ليها قيمة":"EVERY DROP MATTERS"}</span><h2>{ar?"جاهز تخلي التغيير عادة؟":"Ready to make change a habit?"}</h2><p>{ar?"ابدأ بخطوة بسيطة دلوقتي، وخلي المياه جزء من اختياراتك الواعية كل يوم.":"Start with one small action today and make water-wise choices part of your everyday life."}</p></div>
     <Link className="ww-footer-cta-button" href={"/"+lang+"/tools"}>{ar?"ابدأ دلوقتي":"Get started"}<Arrow size={19}/></Link>
    </div>
    <div className="ww-footer-main">
     <div className="ww-footer-intro">
      <Link href={"/"+lang} className="ww-footer-brand"><span><Droplets size={29}/></span><strong>WaterWise <em>Egypt</em></strong></Link>
      <p>{ar?"من الوعي إلى الفعل. تجربة تعليمية تساعدك تفهم المياه، وتغيّر عاداتك بخطوات صغيرة وقابلة للتطبيق.":"From awareness to action. A thoughtful learning experience for smarter everyday water habits."}</p>
      <span className="ww-footer-affiliation"><Leaf size={17}/>{ar?"مشروع طلاب جامعة العلمين الدولية":"Alamein International University student project"}</span>
     </div>
     <div className="ww-footer-link-group"><h3>{ar?"اكتشف":"Explore"}</h3><Link href={"/"+lang+"/tools"}>{tr.nav.tools}</Link><Link href={"/"+lang+"/learn"}>{tr.nav.learn}</Link><Link href={"/"+lang+"/challenges"}>{tr.nav.challenges}</Link><Link href={"/"+lang+"/dashboard"}>{ar?"حسابي وإنجازاتي":"My account & progress"}</Link></div>
     <div className="ww-footer-link-group"><h3>{ar?"المشروع":"The project"}</h3><Link href={"/"+lang+"/about"}>{tr.nav.team}</Link><Link href={"/"+lang+"/about#our-team"}>{ar?"فريق العمل":"Our team"}</Link><Link href={"/"+lang+"/about#project-report"}><FileText size={15}/>{ar?"ملف البحث":"Research report"}</Link><Link href={"/"+lang+"/research"}>{tr.nav.research}</Link></div>
     <div className="ww-footer-mission"><span><Target size={22}/></span><h3>{ar?"رسالتنا":"Our mission"}</h3><p>{ar?"محتوى مفيد، تجارب تفاعلية، وعادات تساعدنا نتعامل مع المياه بمسؤولية.":"Accessible knowledge, interactive tools and habits that encourage responsible water use."}</p><Link href={"/"+lang+"/privacy"}><Shield size={15}/>{ar?"سياسة الخصوصية":"Privacy policy"}<ArrowUpRight size={15}/></Link></div>
    </div>
    <div className="ww-footer-bottom"><span>© 2026 WaterWise Egypt</span><span>{ar?"صُنع بشغف في جامعة العلمين الدولية":"Made with care at Alamein International University"}</span><span className="ww-footer-bottom-tag"><Droplets size={15}/> SDG 06</span></div>
   </div>
  </footer>
 </div>;
}

"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";
import {Droplets, Menu, X, Languages, ArrowUpRight, Waves, Github, UserRound} from "lucide-react";
import {Lang,t} from "@/lib/content";
export function SiteShell({lang,children}:{lang:Lang;children:React.ReactNode}){
 const [open,setOpen]=useState(false);const path=usePathname();const tr=t[lang];const other=lang==="ar"?"en":"ar";
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";},[lang]);
 const links=[["",tr.nav.home],["tools",tr.nav.tools],["learn",tr.nav.learn],["challenges",tr.nav.challenges],["dashboard",tr.nav.dashboard],["research",tr.nav.research],["team",tr.nav.team]] as const;
 return <div className="site" dir={lang==="ar"?"rtl":"ltr"} lang={lang}>
  <div className="announcement"><Waves size={15}/><span>{lang==="ar"?"المياه مورد مشترك، وكل عادة صغيرة ممكن تبدأ فرق.":"Water is a shared resource. Change starts with small habits."}</span></div>
  <header className="header"><div className="container navrow">
   <Link href={"/"+lang} className="brand"><span className="brand-icon"><Droplets size={27} strokeWidth={2.5}/></span><span className="brand-text"><strong>WaterWise <em>Egypt</em></strong><small>{tr.tagline}</small></span></Link>
   <nav className={"navlinks"+(open?" open":"")} aria-label="Primary navigation">{links.map(([url,label])=><Link key={url} onClick={()=>setOpen(false)} className={path==="/"+lang+(url?"/"+url:"")?"active":""} href={"/"+lang+(url?"/"+url:"")}>{label}</Link>)}</nav>
   <div className="nav-actions">
     <Link className="lang-switch" aria-label="Switch language" href={"/"+other+path.replace(/^\/(ar|en)/,"")}><Languages size={17}/>{tr.english}</Link>
     <Link className="login-link" href={"/"+lang+"/login"}><UserRound size={17}/><span>{tr.nav.login}</span></Link>
     <button className="menu-btn" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
   </div></div></header>
  <main>{children}</main>
  <footer className="footer"><div className="container footer-grid"><div><Link href={"/"+lang} className="footer-brand"><Droplets size={23}/> WaterWise Egypt</Link><p>{tr.footer}</p><p className="mini">{tr.disclaimer}</p></div><div className="footer-nav"><Link href={"/"+lang+"/research"}>{tr.nav.research}</Link><Link href={"/"+lang+"/team"}>{tr.nav.team}</Link><Link href={"/"+lang+"/tools"}>{tr.nav.tools}</Link><a target="_blank" rel="noopener noreferrer" href="https://github.com/Omar-Alshaer/WaterWise-Egypt"><Github size={17}/> GitHub <ArrowUpRight size={13}/></a></div></div></footer>
 </div>;
}
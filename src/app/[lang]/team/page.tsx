import {notFound} from "next/navigation";
import {Users} from "lucide-react";
import {isLang,team} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
export default async function Team({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} kicker={ar?"فريق واتر وايز":"THE PEOPLE BEHIND WATERWISE"} title={ar?"تعرّف على فريقنا":"Meet our team"} description={ar?"وراء WaterWise Egypt خمسة طلاب من جامعة العلمين الدولية، بيجمعهم هدف واحد: نشر ثقافة استخدام المياه بمسؤولية.":"WaterWise Egypt is built by five Alamein International University students working toward more responsible water use."}/>
 <div className="container page-content"><div className="team-grid">{team.map(member=><article className="team-card" key={member.id}>
  <span className="team-initials" aria-hidden="true">{member.name.trim().split(/\s+/).slice(0,2).map(s=>s[0]).join("")}</span>
  <h3>{member.name}</h3><p>{member.faculty}</p>
 </article>)}</div><div className="team-note"><Users size={21}/>{ar?"فريق من تخصصات مختلفة، بيتعاون علشان يخلي الترشيد عادة يومية.":"Different specialties, one shared goal: make water conservation part of daily life."}</div></div></>;
}

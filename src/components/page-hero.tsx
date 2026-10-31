import {Lang,t} from "@/lib/content";
export function PageHero({lang,kicker,title,description}:{lang:Lang;kicker:string;title:string;description:string}){
 return <section className="page-hero"><div className="container"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div></section>;
}
import type {Lang} from "@/lib/content";
import {MascotCorner} from "@/components/mascot-corner";
type Pose="welcome"|"thinking"|"protecting-water"|"celebrating"|"pointing-left";
export function PageHero({lang,kicker,title,description,mascot}:{lang:Lang;kicker:string;title:string;description:string;mascot?:Pose}){
 return <section className={"page-hero"+(mascot?" ww-page-hero-mascot":"")}><div className="container"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>{mascot&&<MascotCorner pose={mascot} className="ww-page-hero-character"/>}</section>;
}

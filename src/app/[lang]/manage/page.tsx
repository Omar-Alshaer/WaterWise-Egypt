import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {AdminDashboard} from "@/components/admin-dashboard";
export default async function Manage({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} kicker="WATERWISE CONTROL CENTER" title={ar?"مركز الإدارة والتقارير":"Administration & reporting"} description={ar?"متابعة الحسابات ونتائج الأنشطة، للمشرفين المصرح لهم فقط.":"Account and activity reports for authorized administrators only."}/><div className="container page-content"><AdminDashboard lang={lang}/></div></>;
}

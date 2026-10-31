import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {ProgressWidget} from "@/components/prototype-widgets";
import {AccountStatus} from "@/components/account-status";
import {AccountDeletion} from "@/components/account-deletion";
import {CloudSyncStatus} from "@/components/cloud-sync-status";
import {AuthExperienceGate} from "@/components/auth-experience-gate";
export default async function Account({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} mascot="pointing-left" kicker={ar?"ملفي الشخصي":"MY PROFILE"} title={ar?"حسابي":"My account"} description={ar?"معلوماتك الشخصية وإنجازاتك ونتائج أنشطتك، في مكان واحد خاص بيك.":"Your profile details, achievements and activity results, all in your own space."}/>
  <div className="container page-content dashboard-layout"><AuthExperienceGate kind="account" lang={lang}><AccountStatus lang={lang}/><ProgressWidget lang={lang}/><CloudSyncStatus lang={lang}/><AccountDeletion lang={lang}/></AuthExperienceGate></div></>;
}

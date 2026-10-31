import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {ProgressWidget} from "@/components/prototype-widgets";
import {AccountStatus} from "@/components/account-status";
import {AccountDeletion} from "@/components/account-deletion";
import {CloudSyncStatus} from "@/components/cloud-sync-status";
export default async function Dashboard({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} kicker={ar?"مساحتك الخاصة":"YOUR SPACE"} title={ar?"حسابي وإنجازاتي":"My account & achievements"} description={ar?"كل معلومات حسابك ونتائج الاختبارات والتحديات اللي خلصتها في مكان واحد.":"Your profile, quiz results, completed challenges and water-use estimates together."}/><div className="container page-content dashboard-layout"><AccountStatus lang={lang}/><ProgressWidget lang={lang}/><CloudSyncStatus lang={lang}/><AccountDeletion lang={lang}/></div></>;
}

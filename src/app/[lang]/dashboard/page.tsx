import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {ProgressWidget} from "@/components/prototype-widgets";
import {AccountStatus} from "@/components/account-status";
import {AccountDeletion} from "@/components/account-deletion";
import {CloudSyncStatus} from "@/components/cloud-sync-status";
export default async function Dashboard({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} kicker="MY PROGRESS" title={ar?"لوحة تقدمك":"Your personal progress"} description={ar?"نتائج الحاسبة والاختبارات والتحديات المُبلغ عنها ذاتيًا. بعد تسجيل الدخول يتم حفظ البيانات السحابية في حسابك.":"Calculator estimates, quiz scores and self-reported challenges. Signed-in activity is synchronized to your private Firestore record."}/><div className="container page-content dashboard-layout"><AccountStatus lang={lang}/><CloudSyncStatus lang={lang}/><ProgressWidget lang={lang}/><AccountDeletion lang={lang}/></div></>;
}
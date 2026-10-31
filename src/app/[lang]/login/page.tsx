import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {AuthForm} from "@/components/auth-form";
export default async function Login({params}:{params:Promise<{lang:string}>}) {
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} mascot="welcome" kicker={ar?"أهلًا بيك":"WELCOME BACK"} title={ar?"حسابك مع WaterWise Egypt":"Your WaterWise Egypt account"} description={ar?"سجّل دخولك علشان تتابع إنجازاتك وتحفظ نتائجك في حسابك.":"Sign in to track your achievements and keep your results in your account."}/><div className="container page-content auth-page"><AuthForm lang={lang}/></div></>;
}

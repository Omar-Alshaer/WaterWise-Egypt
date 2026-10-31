import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {PageHero} from "@/components/page-hero";
import {AuthForm} from "@/components/auth-form";
export default async function Login({params}:{params:Promise<{lang:string}>}) {
 const {lang}=await params;if(!isLang(lang))notFound();const ar=lang==="ar";
 return <><PageHero lang={lang} kicker="FIREBASE AUTHENTICATION" title={ar?"حسابك مع WaterWise Egypt":"Your WaterWise Egypt account"} description={ar?"تسجيل دخول بالإيميل أو Google، وبياناتك محفوظة في ملف شخصي لحظي عند تفعيل Firebase.":"Sign in using email or Google; your profile updates in real time once Firebase is configured."}/><div className="container page-content auth-page"><AuthForm lang={lang}/></div></>;
}

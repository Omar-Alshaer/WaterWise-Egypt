import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {SiteShell} from "@/components/site-shell";
export function generateStaticParams(){return [{lang:"ar"},{lang:"en"}];}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();
 return <SiteShell lang={lang}>{children}</SiteShell>;
}
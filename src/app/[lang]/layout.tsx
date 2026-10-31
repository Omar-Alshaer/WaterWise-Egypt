import "../globals.css";
import "../polish.css";
import "../experience.css";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {isLang} from "@/lib/content";
import {SiteShell} from "@/components/site-shell";
import {AppProviders} from "@/components/app-providers";
export const metadata:Metadata={
 title:{default:"WaterWise Egypt | From Awareness to Action",template:"%s | WaterWise Egypt"},
 description:"Research-led bilingual water conservation education for Egyptian university students and households.",
 applicationName:"WaterWise Egypt",
 metadataBase:new URL("https://wwe.alamein.site")
};
export function generateStaticParams(){return [{lang:"ar"},{lang:"en"}];}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();
 return <html lang={lang} dir={lang==="ar"?"rtl":"ltr"} suppressHydrationWarning>
  <body><AppProviders><SiteShell lang={lang}>{children}</SiteShell></AppProviders></body>
 </html>;
}
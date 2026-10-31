import "../globals.css";
import "../polish.css";
import "../experience.css";
import "../brand-refresh.css";
import "../final-polish.css";
import "../qa-refinements.css";
import "../final-release-fixes.css";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {isLang} from "@/lib/content";
import {SiteShell} from "@/components/site-shell";
import {AppProviders} from "@/components/app-providers";
export function generateMetadata({params}: {params:Promise<{lang:string}>}):Promise<Metadata> {
 return params.then(({lang})=>{
  const ar=lang==="ar";
  const title=ar?"WaterWise Egypt | من الوعي إلى الفعل":"WaterWise Egypt | From Awareness to Action";
  const description=ar?"اتعلّم ترشيد المياه، اختبر معلوماتك، وابدأ تحدياتك مع WaterWise Egypt.":"Learn practical water-saving habits, take quizzes and start challenges with WaterWise Egypt.";
  return {
   title:{default:title,template:"%s | WaterWise Egypt"},
   description,
   applicationName:"WaterWise Egypt",
   metadataBase:new URL("https://wwe.alamein.site"),
   openGraph:{type:"website",siteName:"WaterWise Egypt",title,description,url:"https://wwe.alamein.site/"+(ar?"ar":"en"),locale:ar?"ar_EG":"en_US",alternateLocale:ar?"en_US":"ar_EG",images:[{url:"/brand/og-image.png",alt:"WaterWise Egypt — From Awareness to Action"}]},
   twitter:{card:"summary_large_image",title,description,images:["/brand/og-image.png"]},
   icons:{icon:[{url:"/icon.svg",type:"image/svg+xml"},{url:"/mascots/welcome.png",type:"image/png",sizes:"1254x1254"}],apple:[{url:"/mascots/welcome.png",sizes:"1254x1254",type:"image/png"}]},
   robots:{index:true,follow:true}
  } satisfies Metadata;
 });
}
export function generateStaticParams(){return [{lang:"ar"},{lang:"en"}];}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();
 return <html lang={lang} dir={lang==="ar"?"rtl":"ltr"} suppressHydrationWarning>
  <body><AppProviders><SiteShell lang={lang}>{children}</SiteShell></AppProviders></body>
 </html>;
}
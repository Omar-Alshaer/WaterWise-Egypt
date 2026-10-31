import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
import {AdminDashboard} from "@/components/admin-dashboard";
export const metadata:Metadata={title:"WaterWise Control Center",robots:{index:false,follow:false}};
export default async function Manage({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();
 return <div className="adm-outer"><AdminDashboard lang={lang}/></div>;
}

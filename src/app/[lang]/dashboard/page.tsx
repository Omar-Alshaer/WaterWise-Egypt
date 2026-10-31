import {redirect,notFound} from "next/navigation";
import {isLang} from "@/lib/content";
export default async function OldDashboard({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();redirect("/"+lang+"/account");}

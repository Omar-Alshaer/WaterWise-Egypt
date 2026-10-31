import {redirect} from "next/navigation";
import {notFound} from "next/navigation";
import {isLang} from "@/lib/content";
export default async function TeamRedirect({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(!isLang(lang))notFound();redirect("/"+lang+"/about");
}

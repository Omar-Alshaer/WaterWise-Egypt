"use client";
import {useEffect,useState} from "react";
import {Cloud,CloudOff,LoaderCircle,CheckCircle2} from "lucide-react";
import {useAuth} from "./auth-provider";
import type {Lang} from "@/lib/content";
export function CloudSyncStatus({lang}:{lang:Lang}){
 const {user,profile}=useAuth();
 const ar=lang==="ar";
 const [status,setStatus]=useState<"local"|"synced"|"failed">("local");
 useEffect(()=>{
  setStatus("local");
  const handle=(e:Event)=>setStatus((e as CustomEvent<string>).detail==="synced"?"synced":"failed");
  window.addEventListener("wwe-sync",handle);
  return()=>window.removeEventListener("wwe-sync",handle);
 },[user?.uid]);
 return <div className={"notice "+(status==="failed"?"warning":"")}>
  {status==="failed"?<CloudOff size={17}/>:status==="synced"?<CheckCircle2 size={17}/>:<Cloud size={17}/>}
  {user&&profile?
    status==="failed"?(ar?"تعذر حفظ آخر تغيير على حسابك. بياناتك موجودة على الجهاز؛ حاول تاني لما الاتصال يتحسن.":"Could not save the last change to your account. Your device copy is still available."):
    status==="synced"?(ar?"آخر تغيير اتحفظ في حسابك بنجاح.":"Your latest change has been saved to your account."):
    (ar?"نتائجك الجديدة بتتحفظ في حسابك لما تضغط حفظ.":"Your new results are saved to your account when you save them.")
  :ar?"سجّل دخولك علشان تفضل إنجازاتك معاك على أي جهاز.":"Sign in to keep your achievements across your devices."}
 </div>;
}

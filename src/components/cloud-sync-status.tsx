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
    status==="failed"?(ar?"فشلت المزامنة مع Firestore؛ البيانات محفوظة محليًا فقط. راجع الاتصال وقواعد البيانات.":"Firestore sync failed; data remain locally saved. Check connectivity and security rules."):
    status==="synced"?(ar?"آخر تغيير اتزامن مع Firestore.":"Last change synchronized with Firestore."):
    (ar?"حسابك متصل؛ التغييرات الجديدة هتتزامن مع Firestore بعد الحفظ.":"Signed-in changes will sync to Firestore after saving.")
  :ar?"أنت حاليًا في وضع الحفظ المحلي، سجّل الدخول لحفظ البيانات على حسابك.":"You are using local-only storage. Sign in to sync activity to your account."}
 </div>;
}

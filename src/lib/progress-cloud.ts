"use client";
import {useEffect,useState} from "react";
import {doc,onSnapshot,serverTimestamp,setDoc} from "firebase/firestore";
import {getFirebaseAuth,getFirebaseStore} from "@/lib/firebase";
import {useAuth} from "@/components/auth-provider";

export type Progress={
 estimate?:number;checked?:string[];challenges?:string[];pre?:number;post?:number;
};
const GUEST_KEY="wwe-progress-guest-v2";
function storageKey(){const uid=getFirebaseAuth()?.currentUser?.uid;return uid?"wwe-progress-user-"+uid:GUEST_KEY;}
export function getProgress():Progress {
 if(typeof window==="undefined")return {};
 try{return JSON.parse(localStorage.getItem(storageKey())||"{}") as Progress;}catch{return {};}
}
function emit(){if(typeof window!=="undefined")window.dispatchEvent(new Event("wwe-progress-updated"));}
export function saveProgress(data:Partial<Progress>){
 if(typeof window==="undefined")return;
 const user=getFirebaseAuth()?.currentUser,db=getFirebaseStore();
 // Interactive actions require an authenticated account; never persist guest progress.
 if(!user||!db)return;
 const latest={...getProgress(),...data};
 try{localStorage.setItem(storageKey(),JSON.stringify(latest));emit();}catch{}
 // Only the fields managed by this feature are sent; never user roles or private data.
 setDoc(doc(db,"users",user.uid,"progress","current"),{...latest,updatedAt:serverTimestamp()},{merge:true})
  .then(()=>window.dispatchEvent(new CustomEvent("wwe-sync",{detail:"synced"})))
  .catch(()=>window.dispatchEvent(new CustomEvent("wwe-sync",{detail:"failed"})));
}
export function useProgress(){
 const [data,setData]=useState<Progress>({});
 useEffect(()=>{
  const sync=()=>setData(getProgress());
  sync();window.addEventListener("wwe-progress-updated",sync);window.addEventListener("storage",sync);
  return()=>{window.removeEventListener("wwe-progress-updated",sync);window.removeEventListener("storage",sync);};
 },[]);
 return data;
}
/** The active account is always isolated from guest/other accounts. Do not silently upload guest data. */
export function ProgressBridge(){
 const {user,profile}=useAuth();
 useEffect(()=>{emit();},[user?.uid]);
 useEffect(()=>{
  const db=getFirebaseStore();if(!user||!profile||!db)return;
  return onSnapshot(doc(db,"users",user.uid,"progress","current"),snapshot=>{
   if(!snapshot.exists())return;
   const saved=snapshot.data() as Progress;const cleaned:Progress={};
   for(const k of ["estimate","checked","challenges","pre","post"] as const){
    if(saved[k]!==undefined)(cleaned as unknown as Record<string,unknown>)[k]=saved[k];
   }
   try{localStorage.setItem("wwe-progress-user-"+user.uid,JSON.stringify(cleaned));emit();}catch{}
  },()=>{window.dispatchEvent(new CustomEvent("wwe-sync",{detail:"failed"}));});
 },[user?.uid,profile]);
 return null;
}

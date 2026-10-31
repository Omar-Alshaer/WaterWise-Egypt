"use client";
import {useEffect,useState} from "react";
import {useAuth} from "@/components/auth-provider";
import Image from "next/image";

// A short first-visit brand introduction, never a fake network progress bar.
// Once auth is resolved it closes after 3.2s; hard limit 6s prevents blocking on failures.
export function StartupSplash(){
 const {initializing}=useAuth();
 const [visible,setVisible]=useState(true);
 const [minElapsed,setMinElapsed]=useState(false);
 const [maxElapsed,setMaxElapsed]=useState(false);
 useEffect(()=>{
  let seen=false;
  try{seen=sessionStorage.getItem("wwe-splash-seen") === "1";}catch{}
  if(seen){setVisible(false);return;}
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const min=window.setTimeout(()=>setMinElapsed(true),reduced?200:3200);
  const max=window.setTimeout(()=>setMaxElapsed(true),6000);
  return()=>{window.clearTimeout(min);window.clearTimeout(max)};
 },[]);
 useEffect(()=>{
  if(!visible||!(maxElapsed||(minElapsed&&!initializing)))return;
  try{sessionStorage.setItem("wwe-splash-seen","1");}catch{}
  setVisible(false);
 },[visible,minElapsed,maxElapsed,initializing]);
 if(!visible)return null;
 return <div className="ww-splash" role="status" aria-live="polite" aria-label="Loading WaterWise Egypt">
  <div className="ww-splash-inner">
   <Image src="/mascots/welcome.png" className="ww-splash-art ww-splash-mascot" width={190} height={190} alt="" priority/>
   <strong className="ww-splash-title">WaterWise <span>Egypt</span></strong>
   <p className="ww-splash-tag">From Awareness to Action</p>
   <div className="ww-splash-indicator"><span/></div>
  </div>
 </div>;
}

"use client";
import {useEffect,useState} from "react";
import {useAuth} from "@/components/auth-provider";

// A short first-visit brand introduction, never a fake network progress bar.
// Once auth is resolved it closes after 2.5s; hard limit 5.5s prevents blocking on failures.
export function StartupSplash(){
 const {initializing}=useAuth();
 const [visible,setVisible]=useState(false);
 const [minElapsed,setMinElapsed]=useState(false);
 const [maxElapsed,setMaxElapsed]=useState(false);
 useEffect(()=>{
  let seen=false;
  try{seen=sessionStorage.getItem("wwe-splash-seen") === "1";}catch{}
  if(seen)return;
  setVisible(true);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const min=window.setTimeout(()=>setMinElapsed(true),reduced?250:2500);
  const max=window.setTimeout(()=>setMaxElapsed(true),5500);
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
   <img src="/water-loading.svg" className="ww-splash-art" width="185" height="185" alt=""/>
   <strong className="ww-splash-title">WaterWise <span>Egypt</span></strong>
   <p className="ww-splash-tag">From Awareness to Action</p>
   <div className="ww-splash-indicator"><span/></div>
  </div>
 </div>;
}

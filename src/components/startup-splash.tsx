"use client";
import {useEffect,useState} from "react";
import {useAuth} from "@/components/auth-provider";

/** Play the complete 5.033s brand animation on the first visit per tab.
 * Never block indefinitely on authentication and respect reduced-motion settings. */
export function StartupSplash(){
 const {initializing}=useAuth();
 const [visible,setVisible]=useState(true),[minElapsed,setMinElapsed]=useState(false),[maxElapsed,setMaxElapsed]=useState(false);
 useEffect(()=>{
  let seen=false;
  try{seen=sessionStorage.getItem("wwe-splash-seen-v2")==="1";}catch{}
  if(seen){setVisible(false);return;}
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const min=window.setTimeout(()=>setMinElapsed(true),reduced?100:5100);
  const max=window.setTimeout(()=>setMaxElapsed(true),reduced?250:7000);
  return()=>{window.clearTimeout(min);window.clearTimeout(max);};
 },[]);
 useEffect(()=>{
  if(!visible||!(maxElapsed||(minElapsed&&!initializing)))return;
  try{sessionStorage.setItem("wwe-splash-seen-v2","1");}catch{}
  setVisible(false);
 },[visible,minElapsed,maxElapsed,initializing]);
 if(!visible)return null;
 return <div className="ww-splash ww-splash-brand" role="status" aria-live="polite" aria-label="Loading WaterWise Egypt">
  <div className="ww-splash-inner">
   {/* SVG uses native SMIL animation; <img> keeps it animating, unlike raster mascot artwork. */}
   <img src="/water-loading.svg" className="ww-splash-art ww-splash-svg" width="206" height="206" alt=""/>
   <strong className="ww-splash-title">WaterWise <span>Egypt</span></strong>
   <p className="ww-splash-tag">From Awareness to Action</p>
   <div className="ww-splash-indicator"><span/></div>
  </div>
 </div>;
}

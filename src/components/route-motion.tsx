"use client";
import {useEffect,useRef,useState} from "react";
import {usePathname} from "next/navigation";
/** Short, non-blocking branded transition on client-side route changes.
 * The full five-second animation remains the first-visit splash. */
export function RouteMotion(){
 const pathname=usePathname();
 const previous=useRef(pathname);
 const [active,setActive]=useState(false);
 useEffect(()=>{
  if(previous.current===pathname)return;
  previous.current=pathname;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  setActive(true);
  const timer=window.setTimeout(()=>setActive(false),3000);
  return()=>window.clearTimeout(timer);
 },[pathname]);
 return <div aria-hidden="true" className={"ww-route-progress"+(active?" ww-route-progress-active":"")}>
  {active&&<div className="ww-route-visual"><img src="/water-loading.svg" width="130" height="130" alt=""/></div>}
 </div>;
}

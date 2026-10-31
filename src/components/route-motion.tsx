"use client";
import {useEffect,useRef,useState} from "react";
import {usePathname} from "next/navigation";
export function RouteMotion(){
 const pathname=usePathname();
 const previous=useRef(pathname);
 const [active,setActive]=useState(false);
 useEffect(()=>{
  if(previous.current===pathname)return;
  previous.current=pathname;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced)return;
  setActive(true);
  const timer=window.setTimeout(()=>setActive(false),540);
  return()=>window.clearTimeout(timer);
 },[pathname]);
 return <div aria-hidden="true" className={"ww-route-progress"+(active?" ww-route-progress-active":"")}/>;
}

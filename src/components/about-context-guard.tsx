"use client";
import {useEffect} from "react";
/** Cosmetic deterrent only. A public PDF URL is still available from the browser. */
export function AboutContextGuard(){
 useEffect(()=>{
  const handler=(event:MouseEvent)=>{
   // Do not interfere with browser controls outside the About page.
   if((event.target as Element|null)?.closest?.(".ww-about"))event.preventDefault();
  };
  document.addEventListener("contextmenu",handler,true);
  return()=>document.removeEventListener("contextmenu",handler,true);
 },[]);
 return null;
}

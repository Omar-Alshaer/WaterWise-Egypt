"use client";
import {useEffect} from "react";
export function ScrollReveal({path}:{path:string}){
 useEffect(()=>{
  const site=document.querySelector<HTMLElement>(".site");
  if(!site)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced||!("IntersectionObserver" in window))return;
  const targets=[...site.querySelectorAll<HTMLElement>("[data-reveal]")];
  if(!targets.length)return;
  // Keep all content accessible/visible without JavaScript or Observer support.
  site.classList.add("ww-reveal-enabled");
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){
    entry.target.classList.add("ww-is-visible");
    observer.unobserve(entry.target);
   }
  },{rootMargin:"0px 0px 30px 0px",threshold:0.08});
  for(const el of targets)observer.observe(el);
  return()=>{observer.disconnect();site.classList.remove("ww-reveal-enabled");};
 },[path]);
 return null;
}

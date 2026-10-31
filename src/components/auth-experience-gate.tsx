"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {ArrowLeft,ArrowRight,LockKeyhole,Sparkles,X,ShieldCheck} from "lucide-react";
import {useAuth} from "@/components/auth-provider";
import type {Lang} from "@/lib/content";
type Kind="calculator"|"learning"|"challenges"|"account";
const copy={
 calculator:{ar:{eyebrow:"احسبها صح",title:"خلّي حساب المياه جزء من حسابك",body:"سجّل دخولك علشان تستخدم الحاسبة وفحص التسريبات وتحفظ تقديراتك وتتابعها من صفحة حسابي.",hint:"نتيجتك وتقديراتك هتفضل مرتبطة بحسابك."},en:{eyebrow:"Your water habits",title:"Make every estimate count",body:"Sign in to use the calculator and leak checks, save your estimates and view them in My Account.",hint:"Your estimates will stay connected to your account."},mascot:"/mascots/protecting-water.png"},
 learning:{ar:{eyebrow:"رحلة التعلّم",title:"اختبر معلوماتك واحتفظ بنتيجتك",body:"المعلومات متاحة للجميع. سجّل دخولك علشان تبدأ الاختبار القبلي والبعدي وتشوف تطوّرك في حسابك.",hint:"اقرأ الدروس بحرية، وبعدها ابدأ الاختبار بحسابك."},en:{eyebrow:"Your learning journey",title:"Track what you learn",body:"The lessons are open to everyone. Sign in to take both quizzes and keep your scores in My Account.",hint:"Explore the lessons freely, then take the quiz."},mascot:"/mascots/thinking.png"},
 challenges:{ar:{eyebrow:"مغامرة جديدة",title:"جاهز تبدأ تحدياتك؟",body:"سجّل دخولك علشان تنجز التحديات، وتشوف التهنئة، وتجمع إنجازاتك في صفحة حسابي.",hint:"كل تحدٍّ بتكمله بيتسجل ضمن إنجازاتك."},en:{eyebrow:"Your next challenge",title:"Ready to start a new challenge?",body:"Sign in to take on challenges, enjoy the celebrations and track achievements in My Account.",hint:"Every completed challenge becomes part of your progress."},mascot:"/mascots/celebrating.png"},
 account:{ar:{eyebrow:"مساحتك الشخصية",title:"إنجازاتك ليك وحدك",body:"سجّل دخولك علشان تشوف صورة حسابك وبياناتك ونتائج اختباراتك والتحديات اللي أنجزتها في مكان واحد.",hint:"معلوماتك وإنجازاتك بتظهر ليك بعد تسجيل الدخول."},en:{eyebrow:"Your own space",title:"Your achievements belong to you",body:"Sign in to view your profile, quiz scores and completed challenges together in My Account.",hint:"Your personal results are visible after you sign in."},mascot:"/mascots/pointing-left.png"}
} as const;
export function AuthExperienceGate({lang,kind,children}:{lang:Lang;kind:Kind;children:ReactNode}){
 const {user,profile,initializing,profileError}=useAuth();
 const [open,setOpen]=useState(true);
 const close=useRef<HTMLButtonElement>(null),link=useRef<HTMLAnchorElement>(null);
 const eligible=Boolean(user&&profile);
 const needsProfile=Boolean(user&&!profile);
 const ar=lang==="ar",t=copy[kind][lang],Arrow=ar?ArrowLeft:ArrowRight;
 const redirect="/"+lang+"/login";
 useEffect(()=>{
  if(initializing||eligible||!open)return;
  const old=document.body.style.overflow;document.body.style.overflow="hidden";
  close.current?.focus();
  const keys=(e:KeyboardEvent)=>{
   if(e.key==="Escape")setOpen(false);
   if(e.key==="Tab"){
    if(e.shiftKey&&document.activeElement===close.current){e.preventDefault();link.current?.focus();}
    else if(!e.shiftKey&&document.activeElement===link.current){e.preventDefault();close.current?.focus();}
   }
  };
  window.addEventListener("keydown",keys);
  return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",keys);};
 },[initializing,eligible,open]);
 if(initializing||needsProfile&&!profileError)return <div className="ww-gate-loading" role="status"><span className="ww-gate-spinner"/>{ar?"بنجهّز تجربتك...":"Preparing your experience..."}</div>;
 if(eligible)return <>{children}</>;
 return <section className="ww-guest-stage">
   <Image src={copy[kind].mascot} alt="" width={180} height={180} className="ww-guest-image"/>
   <span className="ww-gate-eyebrow"><LockKeyhole size={15}/>{ar?"تجربة شخصية":"PERSONAL EXPERIENCE"}</span>
   <h2>{t.title}</h2><p>{t.body}</p>
   <Link href={redirect} className="ww-gate-action">{needsProfile?(ar?"إكمال بيانات حسابي":"Complete my profile"):(ar?"تسجيل الدخول أو إنشاء حساب":"Sign in or create account")}<Arrow size={19}/></Link>
   <small><ShieldCheck size={15}/>{t.hint}</small>
   {open&&<div className="ww-auth-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}>
    <div className="ww-auth-dialog" role="dialog" aria-modal="true" aria-labelledby={"ww-"+kind+"-title"} aria-describedby={"ww-"+kind+"-desc"}>
     <button ref={close} type="button" className="ww-auth-close" aria-label={ar?"إغلاق":"Close"} onClick={()=>setOpen(false)}><X size={21}/></button>
     <Image src={copy[kind].mascot} alt="" width={215} height={215} className="ww-auth-mascot"/>
     <span className="ww-gate-eyebrow"><Sparkles size={15}/>{t.eyebrow}</span>
     <h2 id={"ww-"+kind+"-title"}>{t.title}</h2><p id={"ww-"+kind+"-desc"}>{t.body}</p>
     <Link ref={link} href={redirect} className="ww-gate-action">{needsProfile?(ar?"إكمال بيانات حسابي":"Complete my profile"):(ar?"سجّل دخولك وابدأ":"Sign in to get started")}<Arrow size={18}/></Link>
     <button type="button" className="ww-gate-later" onClick={()=>setOpen(false)}>{ar?"هتفرج الأول":"I'll look around first"}</button>
    </div>
   </div>}
 </section>;
}

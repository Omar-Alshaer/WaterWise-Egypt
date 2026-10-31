"use client";
import {UserCircle2,Cloud,CloudOff,LogIn,ShieldCheck,MailCheck} from "lucide-react";
import Link from "next/link";
import {useAuth} from "./auth-provider";import type {Lang} from "@/lib/content";
export function AccountStatus({lang}:{lang:Lang}){
 const {user,profile,configured,initializing}=useAuth();const ar=lang==="ar";
 return <div className="panel account-status"><div className="status-icon">{profile?<Cloud size={26}/>:user?<UserCircle2 size={26}/>:<CloudOff size={26}/>}</div><div><h2>{initializing?(ar?"جاري تهيئة الحساب":"Initializing account"):profile?(ar?"أهلًا، ":"Welcome, ")+profile.displayName:user?(ar?"أكمل ملفك الشخصي":"Complete your profile"):configured?(ar?"سجّل الدخول لحسابك":"Sign in to your account"):(ar?"حسابات Firebase لم تُفعّل بعد":"Firebase accounts are not configured")}</h2><p className="muted small">{profile?(ar?"ملفك الشخصي بيتحدث لحظيًا، والأنشطة المسجلة بتتزامن مع Firestore.":"Your account and activities sync to Firestore in realtime."):ar?"نتائج الحاسبة والاختبارات محفوظة على المتصفح في المرحلة دي.":"Calculator and quiz activity remains local to this browser during this batch."}</p></div><Link className="btn btn-secondary" href={"/"+lang+"/login"}>{profile?(ar?"حسابي":"Account"):(ar?"فتح التسجيل":"Open sign-in")}<LogIn size={16}/></Link></div>;
}

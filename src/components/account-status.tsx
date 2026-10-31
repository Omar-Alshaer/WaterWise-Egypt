"use client";
import Link from "next/link";
import {UserRound,LogIn,LogOut,Mail,Phone,CheckCircle2,Sparkles,ArrowLeft,ArrowRight} from "lucide-react";
import {useAuth} from "./auth-provider";
import type {Lang} from "@/lib/content";
export function AccountStatus({lang}:{lang:Lang}){
 const {user,profile,configured,initializing,logout}=useAuth();
 const ar=lang==="ar",Arrow=ar?ArrowLeft:ArrowRight;
 const photo=user?.providerData.find(p=>p.providerId==="google.com")?.photoURL||user?.photoURL;
 const name=profile?.displayName||user?.displayName||"";
 const initials=name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"WW";
 if(initializing)return <div className="panel"><p>{ar?"بنجهّز حسابك...":"Getting your account ready..."}</p></div>;
 if(!user)return <section className="account-welcome"><div className="account-welcome-art"><UserRound size={45}/></div><span className="account-eyebrow"><Sparkles size={16}/>{ar?"مساحتك الخاصة":"Your own space"}</span><h2>{ar?"كل إنجازاتك في مكان واحد":"All your achievements in one place"}</h2><p>{ar?"سجّل دخولك وشوف نتائج اختباراتك وتحدياتك وتقديراتك في صفحة حسابك.":"Sign in to see your quiz results, challenges and water estimates together."}</p><Link className="btn btn-primary" href={"/"+lang+"/login"}>{ar?"تسجيل الدخول أو إنشاء حساب":"Sign in or create an account"}<Arrow size={17}/></Link></section>;
 return <section className="account-identity">
  <div className="account-identity-cover" aria-hidden="true"><span className="account-bubble one"/><span className="account-bubble two"/><span className="account-bubble three"/></div>
  <div className="account-identity-content">
   <div className="account-photo-wrap">{photo?<img src={photo} referrerPolicy="no-referrer" alt={ar?"صورتك الشخصية":"Your profile photo"}/>:<span className="account-fallback">{initials}</span>}<span className="account-photo-check" aria-label={ar?"حساب مسجل":"Signed in"}><CheckCircle2 size={21}/></span></div>
   <div className="account-identity-details"><span className="account-eyebrow"><Sparkles size={15}/>{ar?"أهلًا بيك في WaterWise":"Welcome to WaterWise"}</span><h2>{name||user.email||"WaterWise"}</h2>
    <div className="account-detail-list"><span><Mail size={17}/><bdi>{user.email}</bdi></span>{profile?.phone&&<span><Phone size={17}/><bdi>{profile.phone}</bdi></span>}</div>
    {!profile&&<p className="account-complete-note">{ar?"كمّل بيانات حسابك علشان تقدر تحتفظ بإنجازاتك.":"Complete your profile to keep your achievements."} <Link href={"/"+lang+"/login"}>{ar?"إكمال البيانات":"Complete profile"}<Arrow size={15}/></Link></p>}
   </div>
   <button type="button" className="account-signout" onClick={()=>void logout()}><LogOut size={16}/>{ar?"تسجيل الخروج":"Sign out"}</button>
  </div>
 </section>;
}

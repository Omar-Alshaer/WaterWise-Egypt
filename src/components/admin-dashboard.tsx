"use client";
import {useState} from "react";
import {getIdTokenResult,getIdToken} from "firebase/auth";
import {BarChart3,ShieldAlert,Users,Trophy,ClipboardCheck,GraduationCap,RefreshCw,LockKeyhole} from "lucide-react";
import {useAuth} from "./auth-provider";
import type {Lang} from "@/lib/content";
type AdminData={
 sampledUsers:number;hasMoreUsers:boolean;
 totals:{checks:number;challenges:number;estimateCount:number;preCount:number;postCount:number;avgPre:number|null;avgPost:number|null};
 users:{uid:string;email:string;name:string;createdAt:string;lastSignIn:string;emailVerified:boolean;disabled:boolean;provider:string[]}[];
};
export function AdminDashboard({lang}:{lang:Lang}){
 const ar=lang==="ar";const {user,initializing}=useAuth();
 const [status,setStatus]=useState<"idle"|"loading"|"done"|"error">("idle");
 const [message,setMessage]=useState("");
 const [data,setData]=useState<AdminData|null>(null);
 const load=async()=>{
  if(!user)return;
  setStatus("loading");setMessage("");
  try{
   const result=await getIdTokenResult(user,true);
   if(result.claims.admin!==true)throw new Error(ar?"الحساب ليس لديه صلاحية الإدارة.":"This account has no administrator permission.");
   const token=await getIdToken(user);
   const response=await fetch("/api/admin/overview",{headers:{Authorization:"Bearer "+token},cache:"no-store"});
   if(!response.ok)throw new Error(response.status===503?(ar?"لسه في إعداد مطلوب لتشغيل لوحة الإدارة.":"An administrator setting is still missing."):ar?"تعذّر تحميل التقرير، تحقق من الصلاحيات.":"Cannot load report. Check admin permissions.");
   setData(await response.json() as AdminData);setStatus("done");
  }catch(e){setMessage(e instanceof Error?e.message:"Request failed");setStatus("error");}
 };
 if(initializing)return <div className="panel"><RefreshCw size={20}/>{ar?"جاري التحقق...":"Checking session..."}</div>;
 if(!user)return <div className="panel empty-state"><LockKeyhole size={28}/><h2>{ar?"سجل الدخول أولًا":"Sign in first"}</h2><p>{ar?"لوحة الإدارة لا تسمح بالدخول المجهول.":"Admin reports require an authenticated account."}</p></div>;
 return <div className="stack">
 <div className="panel"><span className="tag"><ShieldAlert size={15}/>{ar?"لوحة مقيدة":"Restricted access"}</span><h2 style={{marginTop:15}}>{ar?"التقارير الإدارية":"Administration reports"}</h2><p className="muted small">{ar?"التقرير متاح للمشرفين المصرّح لهم فقط، وبنراجع صلاحيتك في كل طلب. البيانات المعروضة لعينة لا تتجاوز أول 100 حساب لتقليل التكلفة.":"Only authorized administrators can view this report. Your access is checked on every request. Reports are based on the first 100 accounts to control costs."}</p><button className="btn btn-primary" disabled={status==="loading"} onClick={load}><RefreshCw size={17}/>{status==="loading"?(ar?"تحميل...":"Loading..."):ar?"تحميل تقرير الحسابات":"Load account report"}</button>{message&&<p className="notice warning" role="alert" style={{marginTop:15}}>{message}</p>}</div>
 {data&&<><div className="metric-grid">
 {[
  {v:data.sampledUsers,title:ar?"حسابات ضمن العينة":"Sample accounts",I:Users},
  {v:data.totals.checks,title:ar?"فحوص مسجلة ذاتيًا":"Self-reported checks",I:ClipboardCheck},
  {v:data.totals.challenges,title:ar?"تحديات مسجلة":"Reported challenges",I:Trophy}
 ].map(({v,title,I})=><div className="metric-card" key={title}><I size={23}/><strong>{v}</strong><span>{title}</span></div>)}
 </div><div className="panel"><h2><GraduationCap size={23} style={{verticalAlign:"middle"}}/> {ar?"متوسط نتائج الاختبارات":"Average quiz scores"}</h2><p className="muted">{ar?"النتائج الآتية معرفة مُختبرة، مش وفر مياه مقاس.":"These are knowledge-test scores, not verified water savings."}</p><div className="metric-grid" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}><div className="metric-card"><strong>{data.totals.avgPre??"—"}/5</strong><span>{ar?"قبلي":"Pre-quiz"} ({data.totals.preCount})</span></div><div className="metric-card"><strong>{data.totals.avgPost??"—"}/5</strong><span>{ar?"بعدي":"Post-quiz"} ({data.totals.postCount})</span></div></div></div>
 <div className="panel"><h2>{ar?"الحسابات":"User accounts"}</h2><p className="muted small">{ar?"بيانات محدودة للمدير فقط؛ لا تشمل كلمات المرور.":"Admin-only listing; passwords are never displayed."}{data.hasMoreUsers?(ar?" يوجد مستخدمون إضافيون غير معروضين.":" More accounts exist beyond this sample."):""}</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{ar?"الاسم":"Name"}</th><th>{ar?"الإيميل":"Email"}</th><th>{ar?"تم التأكيد":"Verified"}</th><th>{ar?"آخر دخول":"Last sign-in"}</th></tr></thead><tbody>{data.users.map(row=><tr key={row.uid}><td>{row.name||"—"}</td><td dir="ltr">{row.email||"—"}</td><td>{row.emailVerified?"✓":"—"}</td><td>{row.lastSignIn||"—"}</td></tr>)}</tbody></table></div></div>
 </>}
 </div>;
}

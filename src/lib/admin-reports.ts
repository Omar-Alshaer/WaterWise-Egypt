import "server-only";
import type {UserRecord} from "firebase-admin/auth";
import {adminServices} from "@/lib/firebase-admin";

export type AdminUserRow={
 uid:string; name:string; email:string; createdAt:string; lastSignIn:string;
 lastRefresh:string; emailVerified:boolean; disabled:boolean; providers:string[];
 isAdmin:boolean; photoURL:string;
};
export function serializeAdminUser(user:UserRecord):AdminUserRow{
 return {
  uid:user.uid, name:user.displayName||"", email:user.email||"",
  createdAt:user.metadata.creationTime||"", lastSignIn:user.metadata.lastSignInTime||"",
  lastRefresh:user.metadata.lastRefreshTime||"",emailVerified:user.emailVerified,
  disabled:user.disabled,providers:user.providerData.map(x=>x.providerId),
  isAdmin:user.customClaims?.admin===true,photoURL:user.photoURL||""
 };
}
export function parseProgress(data:FirebaseFirestore.DocumentData|undefined){
 if(!data)return {estimate:null as number|null,checked:[] as string[],challenges:[] as string[],pre:null as number|null,post:null as number|null,updatedAt:""};
 const number=(value:unknown)=>typeof value==="number"&&Number.isFinite(value)?value:null;
 const strings=(value:unknown)=>Array.isArray(value)?value.filter((x):x is string=>typeof x==="string").slice(0,4):[];
 const updated=data.updatedAt;
 return {
  estimate:number(data.estimate),checked:strings(data.checked),challenges:strings(data.challenges),
  pre:number(data.pre),post:number(data.post),
  updatedAt:typeof updated?.toDate==="function"?updated.toDate().toISOString():""
 };
}
export function safeAdminError(error:unknown){
 const message=error instanceof Error?error.message:"";
 if(message==="unauthorized")return {status:401,error:"Unauthorized"};
 if(message==="forbidden")return {status:403,error:"Forbidden"};
 if(message==="Firebase Admin SDK not configured")return {status:503,error:"Admin service is not configured"};
 if(message==="auth/user-not-found"||message.includes("no user record"))return {status:404,error:"User not found"};
 return {status:500,error:"Unable to complete administrator request"};
}
const LIMIT=2500;
/** Bounded, explicit-coverage analytics: never represent a sample as site-wide totals. */
export async function collectAdminStats(){
 const {auth,db}=adminServices();
 let cursor:string|undefined;
 let total=0,verified=0,disabled=0,admins=0,google=0,password=0;
 let signedIn7=0,signedIn30=0,registered7=0,registered30=0;
 let progressAccounts=0,checks=0,challenges=0,estimateCount=0;
 let preTotal=0,preCount=0,postTotal=0,postCount=0,pairedCount=0,pairedDelta=0;
 const completed=[0,0,0,0,0];
 const monthCounts=new Map<string,number>(), dayCounts=new Map<string,number>();
 const now=Date.now();
 const day=86_400_000;
 const months=Array.from({length:6},(_,i)=>{
  const d=new Date();d.setUTCDate(1);d.setUTCHours(0,0,0,0);d.setUTCMonth(d.getUTCMonth()-(5-i));
  return d.toISOString().slice(0,7);
 });
 const days=Array.from({length:14},(_,i)=>new Date(now-(13-i)*day).toISOString().slice(0,10));
 for(const m of months)monthCounts.set(m,0);
 for(const d of days)dayCounts.set(d,0);
 do{
  const batch=await auth.listUsers(Math.min(500,LIMIT-total),cursor);
  const users=batch.users;
  total+=users.length;
  for(const u of users){
   if(u.emailVerified)verified++;
   if(u.disabled)disabled++;
   if(u.customClaims?.admin===true)admins++;
   if(u.providerData.some(p=>p.providerId==="google.com"))google++;
   if(u.providerData.some(p=>p.providerId==="password"))password++;
   const created=Date.parse(u.metadata.creationTime||"");
   const signed=Date.parse(u.metadata.lastSignInTime||"");
   if(Number.isFinite(created)){
    const elapsed=now-created;
    if(elapsed<=7*day&&elapsed>=0)registered7++;
    if(elapsed<=30*day&&elapsed>=0)registered30++;
    const month=new Date(created).toISOString().slice(0,7);
    if(monthCounts.has(month))monthCounts.set(month,(monthCounts.get(month)||0)+1);
    const date=new Date(created).toISOString().slice(0,10);
    if(dayCounts.has(date))dayCounts.set(date,(dayCounts.get(date)||0)+1);
   }
   if(Number.isFinite(signed)){
    const elapsed=now-signed;
    if(elapsed<=7*day&&elapsed>=0)signedIn7++;
    if(elapsed<=30*day&&elapsed>=0)signedIn30++;
   }
  }
  // Fetch bounded Firestore docs in compact batches; do not expose raw personal data.
  for(let i=0;i<users.length;i+=75){
   const chunk=users.slice(i,i+75);
   const refs=chunk.map(u=>db.doc("users/"+u.uid+"/progress/current"));
   if(!refs.length)continue;
   const docs=await db.getAll(...refs);
   for(const doc of docs){
    if(!doc.exists)continue;
    progressAccounts++;
    const p=parseProgress(doc.data());
    checks+=p.checked.length;
    challenges+=p.challenges.length;
    completed[p.challenges.length]++;
    if(p.estimate!==null)estimateCount++;
    if(p.pre!==null){preTotal+=p.pre;preCount++;}
    if(p.post!==null){postTotal+=p.post;postCount++;}
    if(p.pre!==null&&p.post!==null){pairedCount++;pairedDelta+=p.post-p.pre;}
   }
  }
  cursor=batch.pageToken;
 }while(cursor&&total<LIMIT);
 const complete=!cursor;
 const round=(v:number,n:number)=>n?Number((v/n).toFixed(2)):null;
 return {
  scannedUsers:total,complete,scanLimit:LIMIT,generatedAt:new Date().toISOString(),
  accounts:{total,verified,disabled,admins,google,password,signedIn7,signedIn30,registered7,registered30},
  activity:{progressAccounts,checks,challenges,estimateCount,preCount,postCount,pairedCount,
   avgPre:round(preTotal,preCount),avgPost:round(postTotal,postCount),
   avgPairedGain:round(pairedDelta,pairedCount),completed},
  registrationsByMonth:months.map(month=>({label:month,count:monthCounts.get(month)||0})),
  registrationsByDay:days.map(date=>({label:date,count:dayCounts.get(date)||0}))
 };
}

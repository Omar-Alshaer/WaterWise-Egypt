import {NextRequest,NextResponse} from "next/server";
import {adminServices,requireAdmin,respondAuthError} from "@/lib/firebase-admin";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 try{
  await requireAdmin(req);
  const {auth,db}=adminServices();
  // Bounded dataset avoids surprising read costs on the free tier.
  const batch=await auth.listUsers(100);
  const users=batch.users.map(u=>({
   uid:u.uid,email:u.email||"",name:u.displayName||"",
   createdAt:u.metadata.creationTime||"",lastSignIn:u.metadata.lastSignInTime||"",
   emailVerified:u.emailVerified,disabled:u.disabled,provider:u.providerData.map(p=>p.providerId)
  }));
  const progressDocs=await Promise.all(users.map(u=>
   db.doc("users/"+u.uid+"/progress/current").get().catch(()=>null)
  ));
  let checks=0,challenges=0,quizPre=0,quizPost=0,preCount=0,postCount=0,estimateCount=0;
  progressDocs.forEach(s=>{
   if(!s?.exists)return;const d=s.data()||{};
   checks+=Array.isArray(d.checked)?d.checked.length:0;
   challenges+=Array.isArray(d.challenges)?d.challenges.length:0;
   if(typeof d.pre==="number"){quizPre+=d.pre;preCount++;}
   if(typeof d.post==="number"){quizPost+=d.post;postCount++;}
   if(typeof d.estimate==="number")estimateCount++;
  });
  const output={
   sampledUsers:users.length,hasMoreUsers:!!batch.pageToken,
   totals:{checks,challenges,estimateCount,preCount,postCount,
    avgPre:preCount?Number((quizPre/preCount).toFixed(2)):null,
    avgPost:postCount?Number((quizPost/postCount).toFixed(2)):null},
   users
  };
  return NextResponse.json(output,{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=respondAuthError(e);return NextResponse.json({error:x.error},{status:x.status,headers:{"Cache-Control":"no-store"}});}
}

import {NextRequest,NextResponse} from "next/server";
import {adminServices,requireAdmin} from "@/lib/firebase-admin";
import {safeAdminError} from "@/lib/admin-reports";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 try{
  await requireAdmin(req);
  const {db}=adminServices();
  const result=await db.collection("adminAuditLogs").orderBy("at","desc").limit(50).get();
  const events=result.docs.map(d=>{
   const x=d.data();
   return {id:d.id,actorUid:String(x.actorUid||""),actorEmail:String(x.actorEmail||""),
    targetUid:String(x.targetUid||""),action:String(x.action||""),
    status:String(x.status||""),at:typeof x.at?.toDate==="function"?x.at.toDate().toISOString():""}
  });
  return NextResponse.json({events},{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=safeAdminError(e);return NextResponse.json({error:x.error},{status:x.status,headers:{"Cache-Control":"no-store"}});}
}

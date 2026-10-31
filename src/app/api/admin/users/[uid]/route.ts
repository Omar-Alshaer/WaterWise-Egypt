import {NextRequest,NextResponse} from "next/server";
import {FieldValue} from "firebase-admin/firestore";
import {adminServices,requireAdmin} from "@/lib/firebase-admin";
import {serializeAdminUser,parseProgress,safeAdminError} from "@/lib/admin-reports";
export const runtime="nodejs";export const dynamic="force-dynamic";
type Params={params:Promise<{uid:string}>};
function uidOk(uid:string){return uid.length>=1&&uid.length<=128&&!uid.includes("/")&&!uid.includes("..")}
export async function GET(req:NextRequest,{params}:Params){
 try{
  const admin=await requireAdmin(req);
  const {uid}=await params;
  if(!uidOk(uid))return NextResponse.json({error:"Invalid user identifier"},{status:400});
  const {auth,db}=adminServices();
  const user=await auth.getUser(uid);
  const [profile,activity]=await db.getAll(db.doc("users/"+uid),db.doc("users/"+uid+"/progress/current"));
  const p=profile.data()||{};
  return NextResponse.json({
   user:serializeAdminUser(user),
   profile:{displayName:typeof p.displayName==="string"?p.displayName:"",
    email:typeof p.email==="string"?p.email:"",phone:typeof p.phone==="string"?p.phone:"",
    phoneVerified:p.phoneVerified===true,consentVersion:typeof p.consentVersion==="string"?p.consentVersion:""},
   progress:parseProgress(activity.data()),
   viewerUid:admin.uid
  },{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=safeAdminError(e);return NextResponse.json({error:x.error},{status:x.status,headers:{"Cache-Control":"no-store"}});}
}
export async function PATCH(req:NextRequest,{params}:Params){
 try{
  const actor=await requireAdmin(req);
  const {uid}=await params;
  if(!uidOk(uid))return NextResponse.json({error:"Invalid user identifier"},{status:400});
  const {action}=await req.json() as {action?:unknown};
  if(!["disable","enable","revoke"].includes(String(action)))return NextResponse.json({error:"Invalid action"},{status:400});
  if(uid===actor.uid)return NextResponse.json({error:"You cannot manage your own admin account"},{status:403});
  const {auth,db}=adminServices();
  const target=await auth.getUser(uid);
  if(target.customClaims?.admin===true)return NextResponse.json({error:"Administrator accounts cannot be modified here"},{status:403});
  const event=await db.collection("adminAuditLogs").add({
   actorUid:actor.uid,actorEmail:actor.email||"",targetUid:uid,action,status:"requested",at:FieldValue.serverTimestamp()
  });
  try{
   if(action==="revoke")await auth.revokeRefreshTokens(uid);
   else {
    await auth.updateUser(uid,{disabled:action==="disable"});
    if(action==="disable")await auth.revokeRefreshTokens(uid);
   }
   await event.update({status:"success",completedAt:FieldValue.serverTimestamp()});
  }catch(e){
   await event.update({status:"failed",completedAt:FieldValue.serverTimestamp()}).catch(()=>{});
   throw e;
  }
  return NextResponse.json({ok:true,action,uid},{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=safeAdminError(e);return NextResponse.json({error:x.error},{status:x.status,headers:{"Cache-Control":"no-store"}});}
}

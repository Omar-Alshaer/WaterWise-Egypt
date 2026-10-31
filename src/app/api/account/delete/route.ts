import {NextRequest,NextResponse} from "next/server";
import {adminServices,requireUser,respondAuthError} from "@/lib/firebase-admin";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){
 try{
  const decoded=await requireUser(req);
  const authAge=Math.floor(Date.now()/1000)-(decoded.auth_time||0);
  if(authAge>300)return NextResponse.json({error:"Please sign in again before deleting your account."},{status:403});
  const {auth,db}=adminServices();
  // Delete only the calling user's data. No user-supplied UID is accepted.
  await db.recursiveDelete(db.doc("users/"+decoded.uid));
  await auth.deleteUser(decoded.uid);
  return NextResponse.json({deleted:true},{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=respondAuthError(e);return NextResponse.json({error:x.error},{status:x.status});}
}

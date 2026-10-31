import {NextRequest,NextResponse} from "next/server";
import {requireAdmin} from "@/lib/firebase-admin";
import {collectAdminStats,safeAdminError} from "@/lib/admin-reports";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 try{
  await requireAdmin(req);
  const stats=await collectAdminStats();
  return NextResponse.json(stats,{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=safeAdminError(e);return NextResponse.json({error:x.error},{status:x.status,headers:{"Cache-Control":"no-store"}});}
}

import {NextRequest,NextResponse} from "next/server";
import {adminServices,requireAdmin} from "@/lib/firebase-admin";
import {serializeAdminUser,parseProgress,safeAdminError} from "@/lib/admin-reports";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 try{
  await requireAdmin(req);
  const {auth,db}=adminServices();
  const url=new URL(req.url);
  const q=(url.searchParams.get("q")||"").trim();
  const size=Number(url.searchParams.get("limit")||25);
  if(!Number.isInteger(size)||size<1||size>50)return NextResponse.json({error:"Invalid page size"},{status:400});
  if(q.length>128)return NextResponse.json({error:"Search text is too long"},{status:400});
  const token=url.searchParams.get("cursor")||undefined;
  if(token&&token.length>2048)return NextResponse.json({error:"Invalid page cursor"},{status:400});
  if(q){
   if(token)return NextResponse.json({error:"Search does not use a page cursor"},{status:400});
   // Global exact-match lookup avoids pretending the paged API does substring name search.
   let user;
   try{
    user=q.includes("@")?await auth.getUserByEmail(q):await auth.getUser(q);
   }catch(e){if((e as {code?:string}).code==="auth/user-not-found")return NextResponse.json({users:[],nextCursor:null,exactMatch:true},{headers:{"Cache-Control":"no-store"}});throw e;}
   const p=await db.doc("users/"+user.uid+"/progress/current").get();
   return NextResponse.json({users:[{...serializeAdminUser(user),progress:parseProgress(p.data())}],nextCursor:null,exactMatch:true},{headers:{"Cache-Control":"no-store"}});
  }
  const result=await auth.listUsers(size,token);
  // Attach per-user activity without exposing contact numbers in the users index.
  const docs=result.users.length?await db.getAll(...result.users.map(u=>db.doc("users/"+u.uid+"/progress/current"))):[];
  const users=result.users.map((user,i)=>({...serializeAdminUser(user),progress:parseProgress(docs[i]?.data())}));
  return NextResponse.json({users,nextCursor:result.pageToken||null,exactMatch:false},{headers:{"Cache-Control":"no-store"}});
 }catch(e){const x=safeAdminError(e);return NextResponse.json({error:x.error},{status:x.status,headers:{"Cache-Control":"no-store"}});}
}

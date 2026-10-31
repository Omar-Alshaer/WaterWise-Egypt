import "server-only";
import {cert,getApp,getApps,initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import type {DecodedIdToken} from "firebase-admin/auth";
import {NextRequest} from "next/server";
import {timingSafeEqual} from "node:crypto";

function configureAdmin(){
 const projectId=process.env.FIREBASE_ADMIN_PROJECT_ID;
 const clientEmail=process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
 const privateKey=process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g,"\n");
 if(!projectId||!clientEmail||!privateKey)throw new Error("Firebase Admin SDK not configured");
 return getApps().length?getApp():initializeApp({credential:cert({projectId,clientEmail,privateKey})});
}
export function adminServices(){
 const app=configureAdmin();
 return {auth:getAuth(app),db:getFirestore(app)};
}
export async function requireUser(request:NextRequest):Promise<DecodedIdToken>{
 const token=request.headers.get("authorization");
 if(!token?.startsWith("Bearer "))throw new Error("unauthorized");
 const {auth}=adminServices();
 return auth.verifyIdToken(token.substring(7),true);
}
export async function requireAdmin(request:NextRequest):Promise<DecodedIdToken>{
 const decoded=await requireUser(request);
 if(decoded.admin!==true)throw new Error("forbidden");
 return decoded;
}
export function respondAuthError(error:unknown){
 const message=error instanceof Error?error.message:"";
 if(message==="unauthorized")return {status:401,error:"Unauthorized"};
 if(message==="forbidden")return {status:403,error:"Forbidden"};
 if(message==="Firebase Admin SDK not configured")return {status:503,error:"Admin service is not configured"};
 return {status:500,error:"Request could not be completed"};
}

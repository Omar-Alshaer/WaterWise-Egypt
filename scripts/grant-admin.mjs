import {cert,initializeApp,getApps,getApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

const projectId=process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail=process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey=process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g,"\n");
const allowEmail=process.env.ADMIN_BOOTSTRAP_EMAIL?.trim();
if(!projectId||!clientEmail||!privateKey||!allowEmail) {
 console.error("Missing Firebase Admin credentials or ADMIN_BOOTSTRAP_EMAIL; no changes made.");process.exit(1);
}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(allowEmail)) {
 console.error("Invalid approved admin email.");process.exit(1);
}
const app=getApps().length?getApp():initializeApp({credential:cert({projectId,clientEmail,privateKey})});
const auth=getAuth(app);
const user=await auth.getUserByEmail(allowEmail);
if(!user.emailVerified){console.error("Email must be verified before granting admin.");process.exit(1);}
const claims={...user.customClaims,admin:true};
await auth.setCustomUserClaims(user.uid,claims);
console.log("Admin claim set for approved account. Sign out and sign in again to refresh token.");

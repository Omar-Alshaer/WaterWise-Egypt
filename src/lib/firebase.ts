import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Public Firebase Web API configuration is supplied through Vercel or .env.local.
// Missing config intentionally leaves auth OFF rather than displaying a broken sign-in.
const config = {
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const firebaseConfigured=Object.values(config).every(value=>typeof value==="string"&&value.length>0);
let app: FirebaseApp | null=null;
export function getFirebaseApp():FirebaseApp|null {
 if (!firebaseConfigured || typeof window==="undefined")return null;
 if (!app) app = getApps().length?getApp():initializeApp(config as {apiKey:string;authDomain:string;projectId:string;appId:string});
 return app;
}
export function getFirebaseAuth():Auth|null {
 const current=getFirebaseApp();return current?getAuth(current):null;
}
export function getFirebaseStore():Firestore|null {
 const current=getFirebaseApp();return current?getFirestore(current):null;
}

import {createUserWithEmailAndPassword,sendEmailVerification,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,updateProfile,type User} from "firebase/auth";
import {doc,getDoc,serverTimestamp,setDoc} from "firebase/firestore";
import {getFirebaseAuth,getFirebaseStore} from "./firebase";

export type SignUpDetails={name:string;email:string;password:string;phone:string;consent:boolean};

export function normalizePhone(phone:string){
 const value=phone.replace(/[\s()-]/g,"");
 if(!/^\+[1-9][0-9]{7,14}$/.test(value))throw new Error("phone-format");
 return value;
}
function services(){const auth=getFirebaseAuth(),db=getFirebaseStore();if(!auth||!db)throw new Error("firebase-not-configured");return {auth,db};}
export async function createProfile(person:User,details:{name:string;phone:string;consent:boolean}){
 const {db}=services();
 const current=doc(db,"users",person.uid);
 const existing=await getDoc(current);
 if(existing.exists())return;
 if(!details.consent)throw new Error("consent-required");
 await setDoc(current,{
  displayName:details.name.trim(),
  email:person.email||"",
  phone:normalizePhone(details.phone),
  phoneVerified:false,
  consentVersion:"2026-10",
  createdAt:serverTimestamp(),
  updatedAt:serverTimestamp()
 });
}
export async function registerAccount(details:SignUpDetails){
 if(!details.consent)throw new Error("consent-required");
 if(details.name.trim().length<2||details.name.trim().length>100)throw new Error("invalid-name");
 normalizePhone(details.phone);
 const {auth}=services();
 const credential=await createUserWithEmailAndPassword(auth,details.email.trim(),details.password);
 await updateProfile(credential.user,{displayName:details.name.trim()});
 await createProfile(credential.user,{name:details.name,phone:details.phone,consent:details.consent});
 await sendEmailVerification(credential.user);
 return credential.user;
}
export async function loginEmail(email:string,password:string){
 const {auth}=services();
 return (await signInWithEmailAndPassword(auth,email.trim(),password)).user;
}
export async function loginGoogle(){
 const {auth}=services();const provider=new GoogleAuthProvider();
 provider.setCustomParameters({prompt:"select_account"});
 return (await signInWithPopup(auth,provider)).user;
}
export async function updateNewGoogleProfile(user:User,phone:string,consent:boolean){
 return createProfile(user,{name:user.displayName||user.email?.split("@")[0]||"WaterWise User",phone,consent});
}
export function authErrorMessage(code:string,ar:boolean){
 const k=code.replace(/^auth\//,"");
 const messages:Record<string,[string,string]>={
  "invalid-credential":["بيانات الدخول غير صحيحة.","Invalid credentials."],
  "email-already-in-use":["الإيميل مسجل بالفعل.","This email is already registered."],
  "weak-password":["استخدم باسورد أقوى (6 أحرف على الأقل).","Use a stronger password (at least 6 characters)."],
  "invalid-email":["اكتب إيميل صحيح.","Enter a valid email address."],
  "popup-closed-by-user":["تم إغلاق نافذة Google.","Google sign-in popup was closed."],
  "popup-blocked":["المتصفح منع نافذة Google، اسمح بالنوافذ للموقع.","Allow popups to sign in with Google."],
  "unauthorized-domain":["الدومين غير مضاف في Firebase Authorized Domains.","Add this domain to Firebase Authorized Domains."],
  "operation-not-allowed":["وسيلة الدخول مش مفعلة في Firebase.","Enable this sign-in provider in Firebase."],
  "permission-denied":["قواعد Firestore لا تسمح بالعملية. راجع إعدادات القواعد.","Firestore rules denied the operation."],
  "phone-format":["اكتب رقم التليفون بصيغة دولية زي +201XXXXXXXXX.","Enter an international phone number, e.g. +201XXXXXXXXX."],
  "invalid-name":["الاسم لازم يكون من حرفين لـ100 حرف.","Name must be 2–100 characters."],
  "consent-required":["لازم توافق على سياسة الخصوصية قبل التسجيل.","Please accept the privacy policy to continue."],
  "firebase-not-configured":["لسه محتاجين نوصل المشروع بـFirebase.","Firebase project configuration is missing."],
 };
 const key=k==="missing-or-insufficient-permissions"?"permission-denied":k;
 const msg=messages[key];return msg?(ar?msg[0]:msg[1]):ar?"تعذر إكمال الطلب. جرّب تاني وراجع اتصالك.":"Request failed. Try again and check your connection.";
}

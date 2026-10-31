"use client";
import {useState} from "react";import {deleteUser,getIdToken,signOut} from "firebase/auth";
import {Trash2,ShieldAlert} from "lucide-react";
import {useAuth} from "./auth-provider";
import type {Lang} from "@/lib/content";
export function AccountDeletion({lang}:{lang:Lang}){
 const ar=lang==="ar";const {user}=useAuth();const [confirmation,setConfirmation]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 if(!user)return null;
 const expected="DELETE";const go=async()=>{
  if(confirmation!==expected)return;
  setBusy(true);setError("");
  try{
   const token=await getIdToken(user,true);
   const r=await fetch("/api/account/delete",{method:"POST",headers:{Authorization:"Bearer "+token}});
   if(!r.ok){const body=await r.json();throw new Error(body.error||"Deletion failed");}
   await signOut(user.auth);
   try{localStorage.removeItem("wwe-progress-user-"+user.uid);}catch{}
   window.location.assign("/"+lang);
  }catch(e){setError(e instanceof Error?e.message:"Deletion failed");setBusy(false);}
 };
 return <div className="panel"><h2><Trash2 size={21} style={{verticalAlign:"middle",marginInlineEnd:8}}/>{ar?"حذف حسابي نهائيًا":"Permanently delete my account"}</h2><p className="muted small">{ar?"هيتم حذف حساب Firebase وبيانات Firestore المرتبطة بيك. العملية لا يمكن التراجع عنها. لو سجّلت دخول من فترة طويلة، هتحتاج تدخل تاني قبل الحذف.":"Delete your Firebase account and associated Firestore records. This is irreversible. Recent authentication is required."}</p><label className="field"><span>{ar?"اكتب DELETE للتأكيد":"Type DELETE to confirm"}</span><input type="text" value={confirmation} onChange={e=>setConfirmation(e.target.value)} placeholder="DELETE"/></label><button type="button" className="btn btn-plain" style={{marginTop:13,borderColor:"#dfa1a1",color:"#ad4545"}} disabled={busy||confirmation!==expected} onClick={go}><ShieldAlert size={16}/>{busy?(ar?"جاري الحذف...":"Deleting..."):ar?"حذف الحساب والبيانات":"Delete account and data"}</button>{error&&<p role="alert" className="error-msg">{error}</p>}</div>;
}

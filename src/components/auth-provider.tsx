"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import {onAuthStateChanged,signOut,type User} from "firebase/auth";
import {doc,onSnapshot,type Unsubscribe} from "firebase/firestore";
import {firebaseAuthEnabled,getFirebaseAuth,getFirebaseStore} from "@/lib/firebase";

export type UserProfile={
 displayName:string;email:string;phone:string;phoneVerified:boolean;
 createdAt?:unknown;updatedAt?:unknown;consentVersion?:string;
};
type AuthState={user:User|null;profile:UserProfile|null;initializing:boolean;configured:boolean;profileError:string|null;logout:()=>Promise<void>};
const AuthContext=createContext<AuthState|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null);
 const [profile,setProfile]=useState<UserProfile|null>(null);
 const [profileError,setProfileError]=useState<string|null>(null);
 const [initializing,setInitializing]=useState(firebaseAuthEnabled);
 useEffect(()=>{
  const auth=getFirebaseAuth(),db=getFirebaseStore();
  if(!auth||!db){setInitializing(false);return;}
  let stopProfile:Unsubscribe|undefined;
  const stopAuth=onAuthStateChanged(auth,person=>{
   stopProfile?.();stopProfile=undefined;setUser(person);setProfile(null);setProfileError(null);
   if(person){
    stopProfile=onSnapshot(doc(db,"users",person.uid),snap=>{
      setProfile(snap.exists()?snap.data() as UserProfile:null);setProfileError(null);
    },()=>{setProfileError("Unable to read your profile. Check Firestore permissions and connectivity.");});
   }
   setInitializing(false);
  },()=>{setInitializing(false);setProfileError("Authentication service is unavailable.");});
  return()=>{stopProfile?.();stopAuth()};
 },[]);
 const logout=useCallback(async()=>{const auth=getFirebaseAuth();if(auth)await signOut(auth);},[]);
 const context=useMemo(()=>({user,profile,initializing,configured:firebaseAuthEnabled,profileError,logout}),[user,profile,initializing,profileError,logout]);
 return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}
export function useAuth(){const state=useContext(AuthContext);if(!state)throw new Error("useAuth must be used inside AuthProvider");return state;}

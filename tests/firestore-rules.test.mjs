import {test,after} from "node:test";
import {readFileSync} from "node:fs";
import {initializeTestEnvironment,assertFails,assertSucceeds} from "@firebase/rules-unit-testing";
import {doc,getDoc,setDoc,updateDoc,serverTimestamp} from "firebase/firestore";

const env=await initializeTestEnvironment({
 projectId:"demo-waterwise",
 firestore:{rules:readFileSync("firestore.rules","utf8"),host:"127.0.0.1",port:8080}
});
after(async()=>{await env.cleanup();});
const a=env.authenticatedContext("user_A",{email:"usera@example.test"}).firestore();
const b=env.authenticatedContext("user_B",{email:"userb@example.test"}).firestore();
const stranger=env.unauthenticatedContext().firestore();
const userA=doc(a,"users","user_A");
const userB=doc(a,"users","user_B");
const makeProfile=()=>({
 displayName:"Test User A",email:"usera@example.test",phone:"+201001234567",
 phoneVerified:false,consentVersion:"2026-10",
 createdAt:serverTimestamp(),updatedAt:serverTimestamp()
});

test("profile owner can create, read and modify allowed fields",async()=>{
 await assertSucceeds(setDoc(userA,makeProfile()));
 await assertSucceeds(getDoc(userA));
 await assertSucceeds(updateDoc(userA,{displayName:"Updated Name",updatedAt:serverTimestamp()}));
});
test("owner may not forge administrator claims in document",async()=>{
 await assertFails(updateDoc(userA,{role:"admin",updatedAt:serverTimestamp()}));
 await assertFails(updateDoc(userA,{admin:true,updatedAt:serverTimestamp()}));
});
test("cross-account reads/writes and unauthenticated reads are denied",async()=>{
 await assertFails(getDoc(userB));
 await assertFails(setDoc(userB,makeProfile()));
 await assertFails(getDoc(doc(stranger,"users","user_A")));
 await assertFails(getDoc(doc(b,"users","user_A")));
});
test("owner may save known progress fields but not private arbitrary data",async()=>{
 const own=doc(a,"users","user_A","progress","current");
 await assertSucceeds(setDoc(own,{
  estimate:540,checked:["tap","toilet"],challenges:["tap-off"],pre:3,post:5,
  updatedAt:serverTimestamp()
 }));
 await assertSucceeds(getDoc(own));
 await assertFails(setDoc(own,{role:"admin",updatedAt:serverTimestamp()},{merge:true}));
 await assertFails(setDoc(own,{pre:200,updatedAt:serverTimestamp()},{merge:true}));
 await assertFails(setDoc(own,{checked:["unknown"],updatedAt:serverTimestamp()},{merge:true}));
 await assertFails(getDoc(doc(b,"users","user_A","progress","current")));
});

"use client";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {AtSign,ArrowLeft,ArrowRight,CheckCircle2,Eye,EyeOff,GoogleIcon,LockKeyhole,Mail,Phone,ShieldCheck,UserRound,LoaderCircle,LogOut} from "./form-icons";
import {sendPasswordResetEmail} from "firebase/auth";
import {PhoneField} from "./phone-field";
import {useAuth} from "./auth-provider";
import {firebaseConfigured,getFirebaseAuth} from "@/lib/firebase";
import {authErrorMessage,createProfile,loginEmail,loginGoogle,normalizePhone,registerAccount} from "@/lib/auth-actions";
import type {Lang} from "@/lib/content";

type Mode="login"|"register"|"reset";
const getError=(e:unknown,ar:boolean)=>authErrorMessage(typeof e==="object"&&e!==null&&"code" in e?String((e as {code:unknown}).code):e instanceof Error?e.message:"unknown",ar);

export function AuthForm({lang}:{lang:Lang}){
 const ar=lang==="ar",Arrow=ar?ArrowLeft:ArrowRight,router=useRouter();
 const {user,profile,initializing,configured,profileError,logout}=useAuth();
 const [mode,setMode]=useState<Mode>("login"),[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[phone,setPhone]=useState(""),[consent,setConsent]=useState(false),[show,setShow]=useState(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[message,setMessage]=useState("");
 const [countryDial,setCountryDial]=useState("+20");
 const clear=()=>{setError("");setMessage("")};
 const next=()=>{router.push("/"+lang+"/dashboard");router.refresh()};
 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();clear();setBusy(true);
  try{
   if(mode==="register"){await registerAccount({name,email,password,phone:normalizePhone(phone,countryDial),consent});setMessage(ar?"تم إنشاء الحساب وإرسال رسالة تأكيد الإيميل.":"Account created. A verification email has been sent.");next();}
   else if(mode==="reset"){const auth=getFirebaseAuth();if(!auth)throw new Error("firebase-not-configured");await sendPasswordResetEmail(auth,email.trim());setMessage(ar?"لو الإيميل مسجل، هتوصله تعليمات استعادة الباسورد.":"If this email is registered, reset instructions will be sent.");}
   else {await loginEmail(email,password);next();}
  }catch(err){setError(getError(err,ar))}finally{setBusy(false)}
 };
 const google=async()=>{clear();setBusy(true);try{await loginGoogle();next()}catch(err){setError(getError(err,ar))}finally{setBusy(false)}};
 const finishProfile=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();clear();if(!user)return;setBusy(true);try{
  if(!consent)throw new Error("consent-required");
  const completePhone=normalizePhone(phone,countryDial);
  await createProfile(user,{name:user.displayName||user.email?.split("@")[0]||"WaterWise Member",phone:completePhone,consent});next();
 }catch(err){setError(getError(err,ar))}finally{setBusy(false)}};
 if(initializing)return <div className="auth-card panel"><LoaderCircle className="spin" size={28}/><p>{ar?"جاري التحقق من الحساب...":"Checking your session..."}</p></div>;
 if(!configured||!firebaseConfigured)return <div className="panel auth-card"><div className="auth-mark"><LockKeyhole size={26}/></div><h2>{ar?"تسجيل الدخول غير متاح مؤقتًا":"Sign in is temporarily unavailable"}</h2><p className="muted">{ar?"التسجيل غير متاح حاليًا. جرّب تاني بعد شوية.":"Sign-in is temporarily unavailable. Please try again later."}</p><div className="notice warning">{ar?"بنحافظ على خصوصية بياناتك، ومش هنطلب منك كلمة المرور من برّه الموقع.":"We will never ask for your password outside our sign-in page."}</div></div>;
 if(user&&profile)return <div className="auth-card panel"><div className="auth-mark"><CheckCircle2 size={28}/></div><h2>{ar?"أهلًا، ":"Welcome, "}{profile.displayName}</h2><p className="muted">{profile.email}</p><p className="muted small">{ar?"إنجازاتك ومعلوماتك الشخصية موجودة في صفحة حسابي.":"Your profile and achievements are available in My Account."}</p><div className="action-row"><Link href={"/"+lang+"/dashboard"} className="btn btn-primary">{ar?"افتح تقدمي":"View dashboard"}<Arrow size={16}/></Link><button type="button" className="btn btn-plain" onClick={()=>logout()}><LogOut size={16}/>{ar?"تسجيل خروج":"Sign out"}</button></div></div>;
 if(user&&!profile)return <div className="auth-card panel"><div className="auth-mark"><UserRound size={27}/></div><h2>{ar?"إكمال ملفك الشخصي":"Complete your profile"}</h2><p className="muted">{ar?"سجلت الدخول، لكن لسه محتاجين رقم موبايل للمساعدة في التواصل، وموافقتك على سياسة الخصوصية.":"You're signed in. Add a contact number and agree to our privacy notice."}</p>{profileError&&<p className="error-msg">{profileError}</p>}
 <form onSubmit={finishProfile} className="auth-fields"><PhoneField lang={lang} value={phone} onChange={setPhone} dialCode={countryDial} onDialCodeChange={setCountryDial}/><label className="consent-row"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{ar?"أوافق على سياسة الخصوصية وتخزين بيانات حسابي.":"I agree to the privacy notice and account data storage."} <Link className="text-link" href={"/"+lang+"/privacy"}>{ar?"اقرأ السياسة":"Read policy"}</Link></span></label><button className="btn btn-primary full-width" disabled={busy||!consent}>{busy?<LoaderCircle className="spin" size={17}/>:<ShieldCheck size={17}/>} {ar?"إكمال الحساب":"Complete account"}</button></form>{error&&<p className="error-msg" role="alert">{error}</p>}<button className="btn btn-plain" style={{marginTop:12}} onClick={()=>logout()}><LogOut size={16}/>{ar?"تسجيل خروج":"Sign out"}</button></div>;
 return <div className="auth-card panel"><div className="auth-mark"><UserRound size={27}/></div><h2>{mode==="login"?(ar?"مرحبًا بعودتك":"Welcome back"):mode==="register"?(ar?"إنشاء حساب جديد":"Create your account"):(ar?"استعادة كلمة المرور":"Reset your password")}</h2><p className="muted small">{ar?"حسابك في WaterWise Egypt علشان تحتفظ بإنجازاتك.":"Your WaterWise Egypt account keeps your achievements together."}</p>
 <div className="auth-tabs">{(["login","register"] as const).map(m=><button type="button" className={"auth-tab "+(mode===m?"selected":"")} onClick={()=>{setMode(m);clear()}} key={m}>{m==="login"?(ar?"دخول":"Sign in"):(ar?"تسجيل جديد":"Sign up")}</button>)}</div>
 <form onSubmit={submit} className="auth-fields">
  {mode==="register"&&<label className="field"><span><UserRound size={15}/>{ar?"الاسم الكامل":"Full name"}</span><input type="text" required autoComplete="name" value={name} minLength={2} maxLength={100} onChange={e=>setName(e.target.value)} placeholder={ar?"الاسم كما تحب يظهر":"Your full name"}/></label>}
  <label className="field"><span><Mail size={15}/>{ar?"البريد الإلكتروني":"Email address"}</span><input type="email" dir="ltr" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></label>
  {mode!=="reset"&&<label className="field"><span><LockKeyhole size={15}/>{ar?"كلمة المرور":"Password"}</span><div className="password-holder"><input type={show?"text":"password"} dir="ltr" required minLength={6} autoComplete={mode==="register"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder={ar?"كلمة المرور":"Password"}/><button type="button" className="show-password" aria-pressed={show} aria-label={show?(ar?"إخفاء كلمة المرور":"Hide password"):(ar?"إظهار كلمة المرور":"Show password")} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>}
  {mode==="register"&&<><PhoneField lang={lang} value={phone} onChange={setPhone} dialCode={countryDial} onDialCodeChange={setCountryDial}/><label className="consent-row"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{ar?"أوافق على سياسة الخصوصية وحفظ بيانات حسابي.":"I agree to the privacy notice and account data storage."} <Link className="text-link" href={"/"+lang+"/privacy"}>{ar?"السياسة":"Policy"}</Link></span></label></>}
  <button type="submit" className="btn btn-primary full-width" disabled={busy||(mode==="register"&&!consent)}>{busy?<LoaderCircle className="spin" size={18}/>:<Arrow size={18}/>} {mode==="login"?(ar?"تسجيل دخول":"Sign in"):mode==="register"?(ar?"إنشاء الحساب":"Create account"):(ar?"إرسال رابط الاستعادة":"Send reset email")}</button>
 </form>
 {mode==="login"&&<><button className="quiet-action" type="button" onClick={()=>{setMode("reset");clear()}}>{ar?"نسيت كلمة المرور؟":"Forgot password?"}</button><div className="auth-divider">{ar?"أو":"or"}</div><button type="button" className="google-btn full-width" onClick={google} disabled={busy}><GoogleIcon/>{ar?"الدخول باستخدام Google":"Continue with Google"}</button></>}
 {mode==="register"&&<><div className="auth-divider">{ar?"أو":"or"}</div><button type="button" className="google-btn full-width" onClick={google} disabled={busy}><GoogleIcon/>{ar?"التسجيل باستخدام Google":"Sign up with Google"}</button></>}
 {mode==="reset"&&<button className="quiet-action" onClick={()=>{setMode("login");clear()}}>{ar?"العودة لتسجيل الدخول":"Back to sign in"}</button>}
 {error&&<p role="alert" className="error-msg">{error}</p>}
 {message&&<p role="status" className="success-msg">{message}</p>}
 <p className="auth-footnote"><ShieldCheck size={15}/>{ar?"بنستخدم رقم الموبايل للتواصل فقط، مش لتسجيل الدخول.":"Your phone number is for contact only, not for signing in."}</p>
 </div>;
}

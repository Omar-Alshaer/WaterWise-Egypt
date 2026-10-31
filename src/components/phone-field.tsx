"use client";
import type {Lang} from "@/lib/content";
export const countryChoices=[
 {code:"+20",ar:"مصر",en:"Egypt",flag:"🇪🇬"},
 {code:"+966",ar:"السعودية",en:"Saudi Arabia",flag:"🇸🇦"},
 {code:"+971",ar:"الإمارات",en:"UAE",flag:"🇦🇪"},
 {code:"+962",ar:"الأردن",en:"Jordan",flag:"🇯🇴"},
 {code:"+965",ar:"الكويت",en:"Kuwait",flag:"🇰🇼"},
 {code:"+974",ar:"قطر",en:"Qatar",flag:"🇶🇦"},
 {code:"+973",ar:"البحرين",en:"Bahrain",flag:"🇧🇭"},
 {code:"+968",ar:"عُمان",en:"Oman",flag:"🇴🇲"}
];
export function PhoneField({lang,value,onChange,dialCode,onDialCodeChange}:{lang:Lang;value:string;onChange:(v:string)=>void;dialCode:string;onDialCodeChange:(v:string)=>void}){
 const ar=lang==="ar";
 return <label className="field phone-field"><span>{ar?"رقم الموبايل":"Mobile number"}</span>
  <div className="phone-composite" dir="ltr">
   <select aria-label={ar?"الدولة ومفتاح الاتصال":"Country and dialing code"} value={dialCode} onChange={e=>onDialCodeChange(e.target.value)}>{countryChoices.map(c=><option key={c.code} value={c.code}>{c.flag} {ar?c.ar:c.en} ({c.code})</option>)}</select>
   <input aria-label={ar?"رقم الموبايل":"Mobile number"} required type="tel" inputMode="tel" dir="ltr" autoComplete="tel-national" value={value} onChange={e=>onChange(e.target.value)} placeholder={dialCode==="+20"?"01XXXXXXXXX":ar?"رقم الموبايل":"Phone number"}/>
  </div>
  <small className="phone-hint">{dialCode==="+20"?(ar?"اكتب رقمك المصري عادي 01... من غير +20":"For Egypt, enter 01... without +20"):ar?"اكتب رقمك المحلي أو الرقم كامل بمفتاح الدولة":"Enter your local number or a full international number"}</small>
 </label>;
}

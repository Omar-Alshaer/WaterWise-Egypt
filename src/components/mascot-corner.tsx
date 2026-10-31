import Image from "next/image";
type Pose="welcome"|"thinking"|"protecting-water"|"celebrating"|"pointing-left";
export function MascotCorner({pose,className="",priority=false}:{pose:Pose;className?:string;priority?:boolean}){
 return <span className={"ww-mascot-corner "+className} aria-hidden="true">
  <Image src={"/mascots/"+pose+".png"} alt="" width={180} height={180} priority={priority} sizes="(max-width: 640px) 80px, 132px"/>
 </span>;
}

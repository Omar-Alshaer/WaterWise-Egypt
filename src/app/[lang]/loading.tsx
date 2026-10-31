import Image from "next/image";
export default function Loading(){return <div className="loading-screen ww-page-loading" role="status" aria-label="Loading WaterWise Egypt"><Image src="/mascots/welcome.png" alt="" width={132} height={132}/><b>WaterWise Egypt</b><span>From Awareness to Action</span><span className="ww-loading-dots" aria-hidden="true"><i/><i/><i/></span></div>;}

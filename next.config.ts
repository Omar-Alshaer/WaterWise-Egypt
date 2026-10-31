import type { NextConfig } from "next";
const config: NextConfig = {
 reactStrictMode: true,
 async redirects(){
  return [
   // The independent management hostname enters the protected admin page.
   {source:"/",has:[{type:"host",value:"manage.wwe.alamein.site"}],destination:"/ar/manage",permanent:false},
   {source:"/",destination:"/ar",permanent:false},
  ];
 }
};
export default config;

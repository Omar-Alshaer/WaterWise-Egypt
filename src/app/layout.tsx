import "./globals.css";
import "./polish.css";
import type { Metadata } from "next";
import {AppProviders} from "@/components/app-providers";
export const metadata:Metadata={
 title:{default:"WaterWise Egypt | From Awareness to Action",template:"%s | WaterWise Egypt"},
 description:"Research-led bilingual water conservation education for Egyptian university students and households.",
 applicationName:"WaterWise Egypt",
 metadataBase:new URL("https://wwe.alamein.site")
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="ar" suppressHydrationWarning><body><AppProviders>{children}</AppProviders></body></html>;
}
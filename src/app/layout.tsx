import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
 title:{default:"WaterWise Egypt | From Awareness to Action",template:"%s | WaterWise Egypt"},
 description:"Research-led bilingual water conservation education for students and households in Egypt.",
 applicationName:"WaterWise Egypt"
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="ar"><body>{children}</body></html>;
}
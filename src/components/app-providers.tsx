"use client";
import {AuthProvider} from "./auth-provider";
import {ProgressBridge} from "@/lib/progress-cloud";
import {StartupSplash} from "./startup-splash";
export function AppProviders({children}:{children:React.ReactNode}){
 return <AuthProvider><ProgressBridge/><StartupSplash/>{children}</AuthProvider>;
}
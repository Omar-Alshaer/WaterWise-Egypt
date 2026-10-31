"use client";
import {AuthProvider} from "./auth-provider";
import {StartupSplash} from "./startup-splash";
export function AppProviders({children}:{children:React.ReactNode}){
 return <AuthProvider><StartupSplash/>{children}</AuthProvider>;
}
import type { Metadata } from 'next'
export const metadata: Metadata = {title:'KALYX',description:'KI-native Compliance-Lernplattform'}
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="de"><body style={{margin:0,fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'}}>{children}</body></html>
}

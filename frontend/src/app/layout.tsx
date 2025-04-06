"use client"

import { ThemeProvider } from "next-themes"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Provider } from "react-redux"
import { store } from "../redux/Store"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <ThemeProvider attribute="class">
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}
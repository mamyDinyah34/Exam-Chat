"use client"

import Link from "next/link"
import { MessageCircle, Menu, Sun, Moon, Users, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Button as MuiButton } from "@mui/material"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 },
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const isDarkMode = theme === "dark"

  return (
    <div className={`flex min-h-screen flex-col ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 h-14 border-b ${isDarkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"} backdrop-blur z-50`}
      >
        <div className="container mx-auto flex h-14 items-center gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            <span className="font-bold text-xl">Mi-Tafa</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <MuiButton
                variant="text"
                size="small"
                sx={{ minWidth: '32px', width: '32px', height: '32px', padding: 0 }}
                onClick={() => {
                  const newTheme = theme === "dark" ? "light" : "dark"
                  setTheme(newTheme)
                  console.log("Theme toggled to:", newTheme)
                }}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </MuiButton>
            </motion.div>

            <div className="md:hidden">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <MuiButton 
                    variant="text" 
                    sx={{ minWidth: '32px' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </MuiButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content 
                    className={`min-w-[160px] rounded-md p-1 shadow-md ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
                    align="end"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className={`rounded px-2 py-2 outline-none cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                      <Link href="/login" className="block w-full">Login</Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className={`rounded px-2 py-2 outline-none cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                      <Link href="/register" className="block w-full">Sign Up</Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/login">
                  <MuiButton variant="text">Login</MuiButton>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/register">
                  <MuiButton variant="contained">Sign Up</MuiButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center space-y-4"
              >
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Connect with friends in real-time
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={`max-w-[600px] ${isDarkMode ? "text-gray-300" : "text-gray-600"} md:text-xl`}
                  >
                    Mi-Tafa makes it easy to stay connected with friends and family. Send messages, share photos, and
                    more.
                  </motion.p>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <motion.div variants={fadeIn} whileHover={buttonHover} className="w-full sm:w-auto">
                    <Link href="/register">
                        <MuiButton className="w-full" variant="contained">Get Started</MuiButton>
                      </Link>
                  </motion.div>
                  <motion.div variants={fadeIn} whileHover={buttonHover} className="w-full sm:w-auto">
                    <Link href="/login">
                      <MuiButton variant="text" className="w-full">Login</MuiButton>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center justify-center"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  alt="Mi-Tafa App Screenshot"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center w-full shadow-lg"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=%20ha"
                />
              </motion.div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className={`w-full py-12 md:py-24 lg:py-32 ${isDarkMode ? "bg-gray-800/40" : "bg-gray-50"}`}
        >
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className={`text-3xl font-bold tracking-tighter md:text-4xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Features
                </h2>
                <p className={`max-w-[900px] ${isDarkMode ? "text-gray-300" : "text-gray-600"} md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                  Everything you need to stay connected with your friends and family
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3"
            >
              <motion.div
                variants={fadeIn}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className={`flex flex-col items-center space-y-2 rounded-lg p-4 ${isDarkMode ? "bg-gray-800/50" : "bg-white"}`}
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Real-time Messaging</h3>
                <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Send and receive messages instantly with real-time updates
                </p>
              </motion.div>
              <motion.div
                variants={fadeIn}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className={`flex flex-col items-center space-y-2 rounded-lg p-4 ${isDarkMode ? "bg-gray-800/50" : "bg-white"}`}
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Friend Management</h3>
                <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Add friends, create groups, and manage your contacts easily
                </p>
              </motion.div>
              <motion.div
                variants={fadeIn}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className={`flex flex-col items-center space-y-2 rounded-lg p-4 ${isDarkMode ? "bg-gray-800/50" : "bg-white"}`}
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Secure & Private</h3>
                <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Your conversations are secure and private with end-to-end encryption
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`border-t py-6 md:py-0 ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
      >
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className={`text-center text-sm leading-loose ${isDarkMode ? "text-gray-400" : "text-gray-600"} md:text-left`}>
            © 2025 Mi-Tafa.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} underline underline-offset-4`}>
              Terms of Service
            </Link>
            <Link href="#" className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} underline underline-offset-4`}>
              Privacy
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
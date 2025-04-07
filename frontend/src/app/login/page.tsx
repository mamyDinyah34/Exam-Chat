"use client"

import type React from "react"
import { useState, useEffect, type Dispatch } from "react"
import { useRouter } from "next/navigation"
import { TextField, Button } from "@mui/material"
import { useTheme } from "next-themes"
import { Mail, Lock, Eye, EyeOff, MessageCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { TOKEN } from "../../redux/Config"
import type { RootState } from "../../redux/Store"
import type { AuthReducerState, LoginRequestDTO } from "../../redux/auth/Model"
import { currentUser, loginUser } from "../../redux/auth/Action"

const SignIn = () => {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [forceLoginMode, setForceLoginMode] = useState(false)

  const dispatch: Dispatch<any> = useDispatch()
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null
  const state: AuthReducerState = useSelector((state: RootState) => state.auth)

  const [signInData, setSignInData] = useState<LoginRequestDTO>({
    email: "",
    password: "",
  })

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle authentication check on mount
  useEffect(() => {
    // Only check token if we're not in force login mode and not already logged in
    if (token && !forceLoginMode && !state.reqUser) {
      dispatch(currentUser(token))
    }
  }, [token, forceLoginMode, state.reqUser, dispatch])

  // Handle redirection after successful login
  useEffect(() => {
    if (state.reqUser && !forceLoginMode) {
      router.push("/home")
    }
  }, [state.reqUser, router, forceLoginMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (forceLoginMode || !state.reqUser) {
      setIsLoggingIn(true)

      // Dispatch login action
      dispatch(loginUser(signInData)).finally(() => {
        setIsLoggingIn(false)
      })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const enableForceLogin = () => {
    setForceLoginMode(true)
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const isDarkMode = theme === "dark"

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div
        className={`w-full max-w-xs ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-2xl overflow-hidden`}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className={`h-6 w-6 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <span className={`font-bold text-xl ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>Mi-Tafa</span>
            </div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>Sign In</h1>
          </div>

          {state.reqUser && !forceLoginMode && (
            <div
              className={`mb-4 p-3 rounded-md text-center ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-blue-50 text-blue-800"}`}
            >
              <p>You're already logged in.</p>
              <button
                onClick={enableForceLogin}
                className={`mt-2 text-sm font-medium ${
                  isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                }`}
              >
                Sign in with different account
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {state.error && (
              <div
                className={`p-3 mb-4 rounded-md text-center ${
                  isDarkMode ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-800"
                }`}
              >
                <p>Invalid credentials. Please try again.</p>
              </div>
            )}
            <div className="relative">
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Email Address
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Mail size={18} />
                </div>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={handleChange}
                  value={signInData.email}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "transparent",
                      color: isDarkMode ? "#fff" : "inherit",
                      paddingLeft: "2.5rem",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
                      opacity: 1,
                    },
                  }}
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Password
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Lock size={18} />
                </div>
                <TextField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={handleChange}
                  value={signInData.password}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "transparent",
                      color: isDarkMode ? "#fff" : "inherit",
                      paddingLeft: "2.5rem",
                      paddingRight: "2.5rem",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
                      opacity: 1,
                    },
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoggingIn}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  padding: "10px 0",
                  background: isDarkMode
                    ? "linear-gradient(to right, #6366f1, #8b5cf6)"
                    : "linear-gradient(to right, #6366f1, #8b5cf6)",
                  "&:hover": {
                    background: isDarkMode
                      ? "linear-gradient(to right, #4f46e5, #7c3aed)"
                      : "linear-gradient(to right, #4f46e5, #7c3aed)",
                  },
                }}
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} inline`}>Don't have an account? </p>
            <button
              onClick={() => router.push("/register")}
              className={`${
                isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
              } font-medium transition-colors`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn

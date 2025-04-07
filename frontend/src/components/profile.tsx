"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation" 
import { useDispatch, useSelector } from "react-redux"
import { IconButton, TextField } from "@mui/material"
import { ArrowLeft, Edit2, Check, X } from "lucide-react"
import type { RootState } from "../redux/Store"
import type { AuthReducerState, UpdateUserRequestDTO } from "../redux/auth/Model"
import { TOKEN } from "../redux/Config"
import { currentUser, updateUser, logoutUser } from "../redux/auth/Action"

interface ProfileProps {
  onCloseProfile: () => void
  initials: string
  stompClientRef: React.MutableRefObject<any> 
}

const Profile = (props: ProfileProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const dispatch = useDispatch()

  const [isEdit, setIsEdit] = useState(false)
  const [fullName, setFullName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string>("")

  const auth: AuthReducerState = useSelector((state: RootState) => state.auth)
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null
  const router = useRouter()
  useEffect(() => {
    if (auth.reqUser) {
      setFullName(auth.reqUser.fullName)
      setEmail(auth.reqUser.email)
    }
  }, [auth.reqUser])

  useEffect(() => {
    if (token && auth.updateUser) {
      dispatch(currentUser(token))
    }
  }, [auth.updateUser, token, dispatch])

  const onEdit = () => {
    setIsEdit(true)
  }

  const onLogout = () => {
    if (props.stompClientRef?.current?.connected) {
      props.stompClientRef.current.deactivate()
    }
    dispatch(logoutUser())
    localStorage.removeItem(TOKEN)
    router.push("/register")
  }
  

  const onUpdateUser = async () => {
    if (fullName && token) {
  
      const data: UpdateUserRequestDTO = {
        fullName: fullName,
      }
  
      const emailChanged = email && email !== auth.reqUser?.email
      const passwordChanged = password.trim() !== ""
  
      if (email) {
        data.email = email
      }
  
      if (passwordChanged) {
        data.password = password
      }
  
      try {
        await dispatch(updateUser(data, token))
        setIsEdit(false)
        setFullName("")
        setEmail("")
        setPassword("")
  
        if (emailChanged || passwordChanged) {
          alert("Your email or password has been changed. Please log in again.")
          onLogout()
          return
        }
        
  
        await dispatch(currentUser(token))
        alert("Profile updated successfully!")
      } catch (error) {
        alert("Failed to update profile. Please try again.")
      } finally {
      }
    }
  }

  const onCancelUpdate = () => {
    if (auth.reqUser) {
      setFullName(auth.reqUser.fullName)
      setEmail(auth.reqUser.email)
    }
    setPassword("")
    setIsEdit(false)
  }

  return (
    <div className={`h-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className={`p-4 border-b flex items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <IconButton onClick={props.onCloseProfile} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          <ArrowLeft size={20} />
        </IconButton>
        <h2 className={`ml-4 text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Profile</h2>
      </div>

      <div className="flex flex-col items-center p-8">
        <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-offset-4 ring-offset-background ring-primary/20 mb-8">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.reqUser?.fullName}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {!isEdit ? (
          <div className="flex items-center justify-center w-full">
            <p className={`text-xl font-medium mr-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {auth.reqUser?.fullName}
            </p>
            <IconButton onClick={onEdit} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              <Edit2 size={18} />
            </IconButton>
          </div>
        ) : (
          <div className="flex flex-col w-full max-w-md gap-4">
            <TextField
              id="fullName"
              label="Full Name"
              type="text"
              value={fullName || ""}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
              fullWidth
              sx={textFieldStyles(isDarkMode)}
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              sx={textFieldStyles(isDarkMode)}
            />
            <TextField
              id="password"
              label="New Password (optional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new if you'd like to change"
              variant="outlined"
              fullWidth
              sx={textFieldStyles(isDarkMode)}
            />
            <div className="flex justify-end gap-2">
              <IconButton onClick={onCancelUpdate} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                <X size={20} />
              </IconButton>
              <IconButton onClick={onUpdateUser} sx={{ color: isDarkMode ? "#6366f1" : "#4f46e5" }}>
                <Check size={20} />
              </IconButton>
            </div>
          </div>
        )}

        <p className={`mt-6 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          This name will appear on your messages
        </p>
      </div>
    </div>
  )
}

const textFieldStyles = (isDarkMode: boolean) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "transparent",
    color: isDarkMode ? "#fff" : "inherit",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.23)",
  },
  "& .MuiInputLabel-root": {
    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
  },
})

export default Profile

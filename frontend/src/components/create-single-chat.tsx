"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useDispatch, useSelector } from "react-redux"
import { TextField, IconButton, Button, InputAdornment } from "@mui/material"
import { ArrowLeft, Search, X, MessageCircle } from "lucide-react"
import { TOKEN } from "../redux/Config"
import type { AppDispatch, RootState } from "../redux/Store"
import { searchUser } from "../redux/auth/Action"
import { createChat } from "../redux/chat/Action"
import type { UserDTO } from "../redux/auth/Model"
import GroupMember from "./group-member"

interface CreateSingleChatProps {
  setIsShowCreateSingleChat: (isShowSingleChat: boolean) => void
}

const CreateSingleChat = (props: CreateSingleChatProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const dispatch = useDispatch<AppDispatch>()

  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)
  const [userQuery, setUserQuery] = useState("")
  const [focused, setFocused] = useState(false)

  const authState = useSelector((state: RootState) => state.auth)
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null

  useEffect(() => {
    if (token && userQuery.length > 0) {
      dispatch(searchUser(userQuery, token))
    }
  }, [userQuery, token, dispatch])

  const onHandleBack = () => {
    props.setIsShowCreateSingleChat(false)
  }

  const onCreate = () => {
    if (token && selectedUser) {
      dispatch(createChat(selectedUser.id, token))
      props.setIsShowCreateSingleChat(false)
    }
  }

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value)
  }

  const onClearQuery = () => {
    setUserQuery("")
  }

  const onSetUser = (user: UserDTO) => {
    setSelectedUser(user)
  }

  return (
    <div className={`h-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className={`p-4 border-b flex items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <IconButton onClick={onHandleBack} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          <ArrowLeft size={20} />
        </IconButton>
        <h2 className={`ml-4 text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Create New Chat</h2>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <p className={`font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Start chat with:</p>

          <div className="min-h-12 mb-4">
            {selectedUser && <GroupMember member={selectedUser} key={selectedUser.id} />}
          </div>
        </div>

        <div className="mb-4">
          <TextField
            id="searchUser"
            type="text"
            label="Search users to chat"
            size="small"
            fullWidth
            value={userQuery}
            onChange={onChangeQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                </InputAdornment>
              ),
              endAdornment:
                userQuery.length > 0 ? (
                  <InputAdornment position="end">
                    <IconButton onClick={onClearQuery} edge="end">
                      <X size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              sx: {
                borderRadius: "8px",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "transparent",
                color: isDarkMode ? "#fff" : "inherit",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.23)",
                },
              },
            }}
            InputLabelProps={{
              shrink: focused || userQuery.length > 0,
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={{
              "& .MuiInputLabel-root": {
                color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
        </div>

        <div className="mb-6 max-h-60 overflow-y-auto">
          {userQuery.length > 0 &&
            authState.searchUser?.map((user) => <GroupMember member={user} onAddMember={onSetUser} key={user.id} />)}
        </div>

        <div className="flex justify-center">
          <Button
            variant="contained"
            onClick={onCreate}
            disabled={!selectedUser}
            startIcon={<MessageCircle size={16} />}
            sx={{
              borderRadius: "8px",
              backgroundColor: isDarkMode ? "#6366f1" : "#4f46e5",
              "&:hover": {
                backgroundColor: isDarkMode ? "#4f46e5" : "#3730a3",
              },
              "&.Mui-disabled": {
                backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.3)",
                color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.7)",
              },
              textTransform: "none",
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            Create Chat
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateSingleChat


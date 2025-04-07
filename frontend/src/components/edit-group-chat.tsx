"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useDispatch, useSelector } from "react-redux"
import { TextField, IconButton, InputAdornment } from "@mui/material"
import { ArrowLeft, Search, X, UserPlus, UserMinus } from "lucide-react"
import { TOKEN } from "../redux/Config"
import type { AppDispatch, RootState } from "../redux/Store"
import { searchUser } from "../redux/auth/Action"
import { addUserToGroupChat, removeUserFromGroupChat } from "../redux/chat/Action"
import type { UserDTO } from "../redux/auth/Model"
import type { ChatDTO } from "../redux/chat/Model"
import GroupMember from "./group-member"

interface EditGroupChatProps {
  setIsShowEditGroupChat: (showCreateGroup: boolean) => void
  currentChat: ChatDTO | null
}

const EditGroupChat = (props: EditGroupChatProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const dispatch = useDispatch<AppDispatch>()

  const [userQuery, setUserQuery] = useState("")
  const [focused, setFocused] = useState(false)

  const authState = useSelector((state: RootState) => state.auth)
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null

  useEffect(() => {
    if (token && userQuery.length > 0) {
      dispatch(searchUser(userQuery, token))
    }
  }, [userQuery, token, dispatch])

  const onRemoveMember = (user: UserDTO) => {
    if (token && props.currentChat) {
      dispatch(removeUserFromGroupChat(props.currentChat.id, user.id, token))
    }
  }

  const onAddMember = (user: UserDTO) => {
    if (token && props.currentChat) {
      dispatch(addUserToGroupChat(props.currentChat.id, user.id, token))
    }
  }

  const handleBack = () => {
    props.setIsShowEditGroupChat(false)
  }

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value)
  }

  const onClearQuery = () => {
    setUserQuery("")
  }

  return (
    <div className={`h-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className={`p-4 border-b flex items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <IconButton onClick={handleBack} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          <ArrowLeft size={20} />
        </IconButton>
        <h2 className={`ml-4 text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Edit Group Chat</h2>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <UserMinus size={16} className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
            <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Current Members</p>
          </div>

          <div className="max-h-40 overflow-y-auto">
            {props.currentChat?.users.map((user) => (
              <GroupMember member={user} onRemoveMember={onRemoveMember} key={user.id} />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <UserPlus size={16} className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
            <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Add Members</p>
          </div>

          <TextField
            id="searchUser"
            type="text"
            label="Search users to add"
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

        <div className="max-h-60 overflow-y-auto">
          {userQuery.length > 0 &&
            authState.searchUser
              ?.filter((user) => {
                const existingUser = props.currentChat?.users.find((existingUser) => existingUser.id === user.id)
                return existingUser === undefined
              })
              .map((user) => <GroupMember member={user} onAddMember={onAddMember} key={user.id} />)}
        </div>
      </div>
    </div>
  )
}

export default EditGroupChat


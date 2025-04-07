"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useDispatch, useSelector } from "react-redux"
import { TextField, IconButton, Button, InputAdornment } from "@mui/material"
import { ArrowLeft, Search, X, Plus } from "lucide-react"
import { TOKEN } from "../redux/Config"
import type { AppDispatch, RootState } from "../redux/Store"
import { searchUser } from "../redux/auth/Action"
import { createGroupChat } from "../redux/chat/Action"
import type { UserDTO } from "../redux/auth/Model"
import GroupMember from "./group-member"

interface CreateGroupChatProps {
  setIsShowCreateGroupChat: (isShowCreateGroupChat: boolean) => void
}

const CreateGroupChat = (props: CreateGroupChatProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const dispatch = useDispatch<AppDispatch>()

  const [groupMember, setGroupMember] = useState<Set<UserDTO>>(new Set())
  const [userQuery, setUserQuery] = useState("")
  const [name, setName] = useState("")
  const [focused, setFocused] = useState(false)

  const authState = useSelector((state: RootState) => state.auth)
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null

  useEffect(() => {
    setName("New Group Chat")
  }, [])

  useEffect(() => {
    if (token && userQuery.length > 0) {
      dispatch(searchUser(userQuery, token))
    }
  }, [userQuery, token, dispatch])

  useEffect(() => {
    if (authState.reqUser) {
      const newGroupMember: Set<UserDTO> = new Set(groupMember)
      newGroupMember.add(authState.reqUser)
      setGroupMember(newGroupMember)
    }
  }, [authState.reqUser])

  const onCreate = () => {
    if (token) {
      const userIds: number[] = Array.from(groupMember).map((member) => member.id)
      dispatch(createGroupChat({ chatName: name, userIds: userIds }, token))
      props.setIsShowCreateGroupChat(false)
    }
  }

  const onRemoveMember = (member: UserDTO) => {
    const updatedMembers: Set<UserDTO> = new Set(groupMember)
    updatedMembers.delete(member)
    setGroupMember(updatedMembers)
  }

  const onAddMember = (member: UserDTO) => {
    const updatedMembers: Set<UserDTO> = new Set(groupMember)
    updatedMembers.add(member)
    setGroupMember(updatedMembers)
  }

  const handleBack = () => {
    props.setIsShowCreateGroupChat(false)
  }

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value)
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onClearQuery = () => {
    setUserQuery("")
  }

  return (
    <div className={`h-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <IconButton onClick={handleBack} className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          <ArrowLeft size={20} />
        </IconButton>
        <h2 className={`ml-4 text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Create New Group Chat
        </h2>
      </div>

      <div className="p-4">
        {/* Group Name */}
        <div className="mb-6">
          <TextField
            id="chatName"
            type="text"
            label="Group Name"
            size="small"
            fullWidth
            value={name}
            onChange={onChangeName}
            sx={{
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
            }}
          />
        </div>

        {/* Members Section */}
        <p className={`font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Members</p>

        <div className="mb-4 max-h-40 overflow-y-auto">
          {groupMember.size > 0 &&
            Array.from(groupMember).map((member) => (
              <GroupMember member={member} onRemoveMember={onRemoveMember} key={member.id} />
            ))}
        </div>

        {/* Search Users */}
        <div className="mb-4">
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

        {/* Search Results */}
        <div className="mb-6 max-h-60 overflow-y-auto">
          {userQuery.length > 0 &&
            authState.searchUser
              ?.filter((user) => !Array.from(groupMember).some((member) => member.id === user.id))
              .map((user) => <GroupMember member={user} onAddMember={onAddMember} key={user.id} />)}
        </div>

        {/* Create Button */}
        <div className="flex justify-center">
          <Button
            variant="contained"
            onClick={onCreate}
            startIcon={<Plus size={16} />}
            sx={{
              borderRadius: "8px",
              backgroundColor: isDarkMode ? "#6366f1" : "#4f46e5",
              "&:hover": {
                backgroundColor: isDarkMode ? "#4f46e5" : "#3730a3",
              },
              textTransform: "none",
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            Create Group Chat
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupChat


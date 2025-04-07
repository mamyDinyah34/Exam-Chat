"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { useDispatch } from "react-redux"
import { IconButton, InputAdornment, Menu, MenuItem, TextField } from "@mui/material"
import { MoreVertical, Search, X, Send, Smile, Users, Trash2, ArrowLeft } from "lucide-react"
import { getChatName } from "../app/utils/Utils"
import type { ChatDTO } from "../redux/chat/Model"
import type { UserDTO } from "../redux/auth/Model"
import type { MessageDTO } from "../redux/message/Model"
import type { AppDispatch } from "../redux/Store"
import { deleteChat } from "../redux/chat/Action"
import { TOKEN } from "../redux/Config"
import MessageCard from "./message-card"
import dynamic from "next/dynamic"

import type { EmojiClickData, Theme } from "emoji-picker-react"
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

interface MessagePageProps {
  chat: ChatDTO
  reqUser: UserDTO | null
  messages: MessageDTO[]
  newMessage: string
  setNewMessage: (newMessage: string) => void
  onSendMessage: () => void
  setIsShowEditGroupChat: (isShowEditGroupChat: boolean) => void
  setCurrentChat: (chat: ChatDTO | null) => void
}

const MessagePage = (props: MessagePageProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const dispatch = useDispatch<AppDispatch>()

  const [messageQuery, setMessageQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const lastMessageRef = useRef<null | HTMLDivElement>(null)
  const open = Boolean(anchor)
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null

  const safeMessages = props.messages || []

  useEffect(() => {
    scrollToBottom()
  }, [safeMessages])

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const onOpenMenu = (e: any) => {
    setAnchor(e.currentTarget)
  }

  const onCloseMenu = () => {
    setAnchor(null)
  }

  const onEditGroupChat = () => {
    onCloseMenu()
    props.setIsShowEditGroupChat(true)
  }

  const onDeleteChat = () => {
    onCloseMenu()
    if (token) {
      dispatch(deleteChat(props.chat.id, token))
      props.setCurrentChat(null)
    }
  }

  const onChangeNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEmojiPickerOpen(false)
    props.setNewMessage(e.target.value)
  }

  const onChangeMessageQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageQuery(e.target.value.toLowerCase())
  }

  const onChangeSearch = () => {
    setIsSearch(!isSearch)
  }

  const onClearQuery = () => {
    setMessageQuery("")
    setIsSearch(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      props.onSendMessage()
    }
  }

  const onOpenEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen)
  }

  const onCloseEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    props.setNewMessage(props.newMessage + emojiData.emoji)
    setIsEmojiPickerOpen(false)
  }

  const onBackToChats = () => {
    props.setCurrentChat(null)
  }

  let lastDay = -1
  let lastMonth = -1
  let lastYear = -1

  const getMessageCard = (message: MessageDTO) => {
    const date: Date = new Date(message.timeStamp)
    const isNewDate = lastDay !== date.getDate() || lastMonth !== date.getMonth() || lastYear !== date.getFullYear()
    if (isNewDate) {
      lastDay = date.getDate()
      lastMonth = date.getMonth()
      lastYear = date.getFullYear()
    }
    return (
      <MessageCard
        message={message}
        reqUser={props.reqUser}
        key={message.id}
        isNewDate={isNewDate}
        isGroup={props.chat?.isGroup || false}
      />
    )
  }

  const chatName = getChatName(props.chat, props.reqUser)

  return (
    <div className="flex flex-col h-full">
      <div
        className={`p-3 sm:p-4 border-b flex justify-between items-center ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center">
          <div className="sm:hidden mr-2">
            <IconButton onClick={onBackToChats} className={isDarkMode ? "text-gray-300" : "text-gray-700"} size="small">
              <ArrowLeft size={20} />
            </IconButton>
          </div>

          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-primary/20 mr-2 sm:mr-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chatName}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-full">{chatName}</p>
            {props.chat?.isGroup && props.chat?.users && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{props.chat.users.length} members</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          {!isSearch ? (
            <IconButton
              onClick={onChangeSearch}
              className={isDarkMode ? "text-gray-300" : "text-gray-700"}
              size="small"
              sx={{ padding: { xs: "4px", sm: "8px" } }}
            >
              <Search size={18} />
            </IconButton>
          ) : (
            <div className="w-32 sm:w-64">
              <TextField
                id="searchMessages"
                type="text"
                placeholder="Search..."
                size="small"
                fullWidth
                value={messageQuery}
                onChange={onChangeMessageQuery}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={onClearQuery}
                        edge="end"
                        size="small"
                        sx={{ padding: { xs: "2px", sm: "4px" } }}
                      >
                        <X size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    height: { xs: "32px", sm: "40px" },
                    borderRadius: "8px",
                    backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                    color: isDarkMode ? "#fff" : "inherit",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#6366f1" : "#4f46e5",
                    },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    padding: { xs: "0 4px", sm: "0 8px" },
                  },
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    padding: { xs: "6px 0", sm: "8px 0" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </div>
          )}

          <IconButton
            onClick={onOpenMenu}
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
            size="small"
            sx={{ padding: { xs: "4px", sm: "8px" } }}
          >
            <MoreVertical size={18} />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchor}
            open={open}
            onClose={onCloseMenu}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
            PaperProps={{
              sx: {
                bgcolor: isDarkMode ? "#1f2937" : "white",
                color: isDarkMode ? "white" : "inherit",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            {props.chat?.isGroup && (
              <MenuItem onClick={onEditGroupChat}>
                <Users size={16} className="mr-2" />
                Edit Group Chat
              </MenuItem>
            )}
            <MenuItem onClick={onDeleteChat}>
              <Trash2 size={16} className="mr-2" />
              {props.chat?.isGroup ? "Delete Group Chat" : "Delete Chat"}
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-2 sm:p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        onClick={onCloseEmojiPicker}
      >
        {messageQuery.length > 0
          ? safeMessages
              .filter((x) => x.content.toLowerCase().includes(messageQuery))
              .map((message) => getMessageCard(message))
          : safeMessages.map((message) => getMessageCard(message))}
        <div ref={lastMessageRef}></div>
      </div>

      <div className={`p-2 sm:p-4 border-t ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        {isEmojiPickerOpen && (
          <div className="absolute bottom-16 sm:bottom-20 right-2 sm:right-4 z-10">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              searchDisabled={true}
              skinTonesDisabled={true}
              theme={(isDarkMode ? "dark" : "light") as Theme}
              width={280}
              height={350}
            />
          </div>
        )}

        <div className="flex items-center">
          <IconButton
            onClick={onOpenEmojiPicker}
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
            size="small"
            sx={{ padding: { xs: "4px", sm: "8px" } }}
          >
            <Smile size={18} />
          </IconButton>

          <div className="flex-1 mx-1 sm:mx-2">
            <TextField
              id="newMessage"
              type="text"
              placeholder="Type a message..."
              size="small"
              multiline
              maxRows={4}
              fullWidth
              value={props.newMessage}
              onChange={onChangeNewMessage}
              onKeyDown={onKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={props.onSendMessage}
                      disabled={!props.newMessage.trim()}
                      size="small"
                      sx={{
                        color: props.newMessage.trim() ? (isDarkMode ? "#6366f1" : "#4f46e5") : "inherit",
                        opacity: props.newMessage.trim() ? 1 : 0.5,
                        padding: { xs: "4px", sm: "8px" },
                      }}
                    >
                      <Send size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  height: { xs: "36px", sm: "40px" },
                  borderRadius: "8px",
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                  color: isDarkMode ? "#fff" : "inherit",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDarkMode ? "#6366f1" : "#4f46e5",
                  },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: { xs: "8px 0", sm: "10px 0" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
                  opacity: 1,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagePage

"use client"
import { useTheme } from "next-themes"
import { useSelector } from "react-redux"
import { Badge } from "@mui/material"
import { Users } from "lucide-react"
import type { ChatDTO } from "../redux/chat/Model"
import type { MessageDTO } from "../redux/message/Model"
import type { RootState } from "../redux/Store"
import { getChatName, getInitialsFromName, transformDateToString } from "../app/utils/Utils"

interface ChatCardProps {
  chat: ChatDTO
}

const ChatCard = (props: ChatCardProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const authState = useSelector((state: RootState) => state.auth)

  if (!props.chat) {
    return null
  }

  const name: string = getChatName(props.chat, authState.reqUser)
  const initials: string = getInitialsFromName(name)
  const isGroupChat = props.chat.users && props.chat.users.length > 2
  const messages = props.chat.messages || []

  const sortedMessages: MessageDTO[] = [...messages].sort((a, b) => +new Date(a.timeStamp) - +new Date(b.timeStamp))

  const lastMessage: MessageDTO | undefined =
    sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1] : undefined

  const lastMessageContent: string =
    lastMessage && lastMessage.content
      ? lastMessage.content.length > 25
        ? lastMessage.content.slice(0, 25) + "..."
        : lastMessage.content
      : ""

  const lastMessageName: string =
    lastMessage && lastMessage.user
      ? lastMessage.user.fullName === authState.reqUser?.fullName
        ? "You"
        : lastMessage.user.fullName
      : ""

  const lastMessageString: string = lastMessage ? lastMessageName + ": " + lastMessageContent : ""

  const lastDate: string =
    lastMessage && lastMessage.timeStamp ? transformDateToString(new Date(lastMessage.timeStamp)) : ""

  const numberOfReadMessages: number = messages.filter((msg) => {
    const isOwnMessage = msg.user && authState.reqUser && msg.user.id === authState.reqUser.id

    const isReadByUser =
      authState.reqUser && msg.readBy && Array.isArray(msg.readBy) && msg.readBy.includes(authState.reqUser.id)

    return isOwnMessage || isReadByUser
  }).length

  const numberOfUnreadMessages: number = messages.length - numberOfReadMessages

  return (
    <div className={`p-4 hover:${isDarkMode ? "bg-gray-700" : "bg-gray-100"} transition-colors`}>
      <div className="flex items-center">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-primary/20 mr-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
          {isGroupChat && (
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-0.5 shadow-md">
              <Users size={12} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className={`font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{name}</p>
              {isGroupChat && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  <Users size={10} className="mr-0.5" />
                  Group
                </span>
              )}
            </div>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{lastDate}</p>
          </div>

          <div className="flex justify-between items-center mt-1">
            <p className={`text-sm truncate ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{lastMessageString}</p>
            {numberOfUnreadMessages > 0 && (
              <Badge
                badgeContent={numberOfUnreadMessages}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: isDarkMode ? "#6366f1" : "#4f46e5",
                    color: "white",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatCard


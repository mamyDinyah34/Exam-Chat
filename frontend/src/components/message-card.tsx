"use client"
import { useTheme } from "next-themes"
import { Chip } from "@mui/material"
import type { MessageDTO } from "../redux/message/Model"
import type { UserDTO } from "../redux/auth/Model"
import { getDateFormat } from "../app/utils/Utils"

interface MessageCardProps {
  message: MessageDTO
  reqUser: UserDTO | null
  isNewDate: boolean
  isGroup: boolean
}

const MessageCard = (props: MessageCardProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const isOwnMessage = props.message.user.id === props.reqUser?.id
  const date: Date = new Date(props.message.timeStamp)
  const hours = date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours()
  const minutes = date.getMinutes() > 9 ? date.getMinutes().toString() : "0" + date.getMinutes()

  return (
    <div className="mb-4">
      {props.isNewDate && (
        <div className="flex justify-center mb-4">
          <Chip
            label={getDateFormat(date)}
            sx={{
              height: "auto",
              padding: "4px 8px",
              backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
              color: isDarkMode ? "#a5b4fc" : "#4f46e5",
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          />
        </div>
      )}

      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[75%] rounded-lg px-4 py-2 ${
            isOwnMessage
              ? isDarkMode
                ? "bg-indigo-600 text-white"
                : "bg-indigo-500 text-white"
              : isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-900"
          }`}
        >
          {props.isGroup && !isOwnMessage && (
            <p className="text-xs font-medium mb-1 opacity-80">{props.message.user.fullName}</p>
          )}

          <div className="flex items-end gap-2">
            <p className="break-words">{props.message.content}</p>
            <span
              className={`text-xs ${isOwnMessage ? "text-indigo-200" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {hours + ":" + minutes}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageCard


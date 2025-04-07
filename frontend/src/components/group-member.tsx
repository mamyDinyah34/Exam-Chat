"use client"
import { useTheme } from "next-themes"
import { IconButton } from "@mui/material"
import { Plus, Minus } from "lucide-react"
import type { UserDTO } from "../redux/auth/Model"

interface GroupMemberProps {
  member: UserDTO
  onRemoveMember?: (member: UserDTO) => void
  onAddMember?: (member: UserDTO) => void
}

const GroupMember = (props: GroupMemberProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const onRemove = () => {
    if (props.onRemoveMember) {
      props.onRemoveMember(props.member)
    }
  }

  const onAdd = () => {
    if (props.onAddMember) {
      props.onAddMember(props.member)
    }
  }

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg mb-2 ${
        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-primary/20 mr-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${props.member.fullName}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <p className={isDarkMode ? "text-white" : "text-gray-900"}>{props.member.fullName}</p>
      </div>

      {props.onAddMember && (
        <IconButton
          onClick={onAdd}
          sx={{
            color: isDarkMode ? "#6366f1" : "#4f46e5",
            "&:hover": {
              backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(79, 70, 229, 0.1)",
            },
          }}
        >
          <Plus size={18} />
        </IconButton>
      )}

      {props.onRemoveMember && (
        <IconButton
          onClick={onRemove}
          sx={{
            color: isDarkMode ? "#ef4444" : "#dc2626",
            "&:hover": {
              backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(220, 38, 38, 0.1)",
            },
          }}
        >
          <Minus size={18} />
        </IconButton>
      )}
    </div>
  )
}

export default GroupMember
"use client"
import { useTheme } from "next-themes"
import { MessageCircle } from "lucide-react"
import type { UserDTO } from "../redux/auth/Model"

interface WelcomePageProps {
  reqUser: UserDTO | null
}

const WelcomePage = (props: WelcomePageProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center items-center space-x-8 mb-8">
          {props.reqUser && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-offset-2 ring-offset-background ring-primary/30">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${props.reqUser.fullName}`}
                alt={`${props.reqUser.fullName}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div
            className={`w-24 h-24 flex items-center justify-center rounded-full ${isDarkMode ? "bg-gray-800" : "bg-indigo-50"}`}
          >
            <MessageCircle size={48} className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
          </div>
        </div>

        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Welcome, {props.reqUser?.fullName}!
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Mi-Tafa makes it easy to stay connected with friends and family.
        </p>
      </div>
    </div>
  )
}

export default WelcomePage


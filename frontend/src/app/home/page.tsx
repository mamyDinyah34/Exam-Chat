"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useDispatch, useSelector } from "react-redux"
import { MessageCircle, Sun, Moon, MoreVertical, Search, X, LogOut, Users, User } from "lucide-react"
import { Divider, TextField, Menu, MenuItem, IconButton, InputAdornment } from "@mui/material"
import { TOKEN, AUTHORIZATION_PREFIX } from "../../redux/Config"
import type { AppDispatch, RootState } from "../../redux/Store"
import { currentUser, logoutUser } from "../../redux/auth/Action"
import { getUserChats, markChatAsRead } from "../../redux/chat/Action"
import { createMessage, getAllMessages } from "../../redux/message/Action"
import type { ChatDTO } from "../../redux/chat/Model"
import type { MessageDTO, WebSocketMessageDTO } from "../../redux/message/Model"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { getInitialsFromName } from "../utils/Utils"

import WelcomePage from "../../components/welcome-page"
import MessagePage from "../../components/message-page"
import CreateGroupChat from "../../components/create-group-chat"
import CreateSingleChat from "../../components/create-single-chat"
import EditGroupChat from "../../components/edit-group-chat"
import Profile from "../../components/profile"
import ChatCard from "../../components/chat-card"

const Homepage = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const dispatch = useDispatch<AppDispatch>()

  const [mounted, setMounted] = useState(false)
  const [isShowEditGroupChat, setIsShowEditGroupChat] = useState(false)
  const [isShowCreateGroupChat, setIsShowCreateGroupChat] = useState(false)
  const [isShowCreateSingleChat, setIsShowCreateSingleChat] = useState(false)
  const [isShowProfile, setIsShowProfile] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const [initials, setInitials] = useState("")
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [currentChat, setCurrentChat] = useState<ChatDTO | null>(null)
  const [messages, setMessages] = useState<MessageDTO[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [messageReceived, setMessageReceived] = useState(false)

  const stompClientRef = useRef<Client | null>(null)

  const open = Boolean(anchor)
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null

  const authState = useSelector((state: RootState) => state.auth)
  const chatState = useSelector((state: RootState) => state.chat)
  const messageState = useSelector((state: RootState) => state.message)

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (token && !authState.reqUser) {
      dispatch(currentUser(token))
    }
  }, [token, dispatch, authState.reqUser])

  useEffect(() => {
    if (!token || authState.reqUser === null) {
      router.push("/login")
    }
  }, [token, router, authState.reqUser])

  useEffect(() => {
    if (authState.reqUser && authState.reqUser.fullName) {
      const letters = getInitialsFromName(authState.reqUser.fullName)
      setInitials(letters)
    }
  }, [authState.reqUser])

  useEffect(() => {
    if (token) {
      dispatch(getUserChats(token))
    }
  }, [
    chatState.createdChat,
    chatState.createdGroup,
    dispatch,
    token,
    messageState.newMessage,
    chatState.deletedChat,
    chatState.editedGroup,
    chatState.markedAsReadChat,
  ])

  useEffect(() => {
    setCurrentChat(chatState.editedGroup)
  }, [chatState.editedGroup])

  useEffect(() => {
    if (currentChat?.id && token) {
      dispatch(getAllMessages(currentChat.id, token))
    }
  }, [currentChat, dispatch, token, messageState.newMessage])

  useEffect(() => {
    setMessages(messageState.messages || [])
  }, [messageState.messages])

  useEffect(() => {
    if (messageState.newMessage && stompClientRef.current && currentChat && isConnected) {
      const webSocketMessage: WebSocketMessageDTO = { ...messageState.newMessage, chat: currentChat }
      stompClientRef.current.publish({
        destination: "/app/messages",
        body: JSON.stringify(webSocketMessage),
      })
    }
  }, [messageState.newMessage, currentChat, isConnected])

  useEffect(() => {
    if (!token || !authState.reqUser) return

    try {
      const client = new Client({
        connectHeaders: {
          Authorization: `${AUTHORIZATION_PREFIX}${token}`,
        },
        debug: (str) => {
          console.log("STOMP: " + str)
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })

      client.webSocketFactory = () => {
        return new SockJS("http://localhost:8080/ws")
      }

      client.onConnect = () => {
        console.log("Connected to WebSocket")
        setIsConnected(true)

        if (authState.reqUser) {
          client.subscribe(`/topic/${authState.reqUser.id}`, () => {
            setMessageReceived(true)
          })
        }
      }

      client.onStompError = (frame) => {
        console.error("STOMP error", frame)
      }

      client.onWebSocketError = (event) => {
        console.error("WebSocket error", event)
      }

      client.activate()
      stompClientRef.current = client

      return () => {
        if (client.connected) {
          client.deactivate()
        }
        stompClientRef.current = null
      }
    } catch (error) {
      console.error("Error setting up WebSocket connection:", error)
    }
  }, [token, authState.reqUser])

  useEffect(() => {
    if (messageReceived && currentChat?.id && token) {
      dispatch(markChatAsRead(currentChat.id, token))
      dispatch(getAllMessages(currentChat.id, token))

      if (token) {
        dispatch(getUserChats(token))
      }
      setMessageReceived(false)
    }
  }, [messageReceived, currentChat, dispatch, token])

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const onSendMessage = () => {
    if (currentChat?.id && token && newMessage.trim()) {
      dispatch(createMessage({ chatId: currentChat.id, content: newMessage }, token))
      setNewMessage("")
    }
  }

  const onOpenProfile = () => {
    onCloseMenu()
    setIsShowProfile(true)
  }

  const onCloseProfile = () => {
    setIsShowProfile(false)
  }

  const onOpenMenu = (e: any) => {
    setAnchor(e.currentTarget)
  }

  const onCloseMenu = () => {
    setAnchor(null)
  }

  const onCreateGroupChat = () => {
    onCloseMenu()
    setIsShowCreateGroupChat(true)
  }

  const onCreateSingleChat = () => {
    setIsShowCreateSingleChat(true)
  }

  const onLogout = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.deactivate()
    }
    dispatch(logoutUser())
    router.push("/login")
  }

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toLowerCase())
  }

  const onClearQuery = () => {
    setQuery("")
  }

  const onClickChat = (chat: ChatDTO) => {
    if (token) {
      dispatch(markChatAsRead(chat.id, token))
    }
    setCurrentChat(chat)
  }

  const buttonClass = `h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center 
  ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} 
  transition-colors duration-200`

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex h-screen">
        <div
          className={`${currentChat ? "hidden sm:flex" : "flex"} w-full sm:w-2/5 md:w-1/3 border-r flex-col ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          {isShowCreateSingleChat && <CreateSingleChat setIsShowCreateSingleChat={setIsShowCreateSingleChat} />}

          {isShowCreateGroupChat && <CreateGroupChat setIsShowCreateGroupChat={setIsShowCreateGroupChat} />}

          {isShowEditGroupChat && (
            <EditGroupChat setIsShowEditGroupChat={setIsShowEditGroupChat} currentChat={currentChat} />
          )}

          {isShowProfile && (
            <div className="h-full">
              <Profile onCloseProfile={onCloseProfile} initials={initials} />
            </div>
          )}

          {!isShowCreateSingleChat && !isShowEditGroupChat && !isShowCreateGroupChat && !isShowProfile && (
            <div className="flex flex-col h-full">
              <div
                className={`p-3 sm:p-4 flex justify-between items-center border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  onClick={onOpenProfile}
                  className="flex items-center gap-1 sm:gap-2 cursor-pointer group transition-all duration-200 ease-in-out rounded-lg p-1 sm:p-1.5 hover:bg-opacity-80"
                >
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authState.reqUser?.fullName}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium leading-none truncate max-w-[100px] sm:max-w-[150px]">
                      {authState.reqUser?.fullName}
                    </p>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button className={buttonClass} onClick={toggleTheme} aria-label="Toggle theme">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>

                  <button className={buttonClass} onClick={onCreateSingleChat} aria-label="Create new chat">
                    <MessageCircle size={18} />
                  </button>

                  <button className={buttonClass} onClick={onOpenMenu} aria-label="Open menu">
                    <MoreVertical size={18} />
                  </button>

                  <Menu
                    anchorEl={anchor}
                    open={open}
                    onClose={onCloseMenu}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: "0.5rem",
                        backgroundColor: isDarkMode ? "rgb(55, 65, 81)" : "white",
                        color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        minWidth: "12rem",
                        overflow: "visible",
                      },
                    }}
                  >
                    <MenuItem
                      onClick={onOpenProfile}
                      sx={{
                        padding: "0.5rem 1rem",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={onCreateGroupChat}
                      sx={{
                        padding: "0.5rem 1rem",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <Users size={16} className="mr-2" />
                      Create Group
                    </MenuItem>
                    <MenuItem
                      onClick={onLogout}
                      sx={{
                        padding: "0.5rem 1rem",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <div className={`p-2 sm:p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <TextField
                  id="search"
                  type="text"
                  placeholder="Search your chats..."
                  size="small"
                  fullWidth
                  value={query}
                  onChange={onChangeQuery}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                      </InputAdornment>
                    ),
                    endAdornment:
                      query.length > 0 ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={onClearQuery}
                            edge="end"
                            size="small"
                            sx={{ padding: { xs: "4px", sm: "8px" } }}
                          >
                            <X size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    sx: {
                      height: { xs: "36px", sm: "40px" },
                      borderRadius: "8px",
                      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                      color: isDarkMode ? "#fff" : "inherit",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: isDarkMode ? "#6366f1" : "#4f46e5",
                      },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      padding: { xs: "0 8px", sm: "0 14px" },
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

              <div className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                {query.length > 0 &&
                  chatState.chats
                    ?.filter((x) =>
                      x.isGroup
                        ? x.chatName.toLowerCase().includes(query)
                        : x.users[0].id === authState.reqUser?.id
                          ? x.users[1].fullName.toLowerCase().includes(query)
                          : x.users[0].fullName.toLowerCase().includes(query),
                    )
                    .map((chat: ChatDTO) => (
                      <div
                        key={chat.id}
                        onClick={() => onClickChat(chat)}
                        className={`cursor-pointer ${
                          currentChat?.id === chat.id ? (isDarkMode ? "bg-gray-700" : "bg-indigo-50") : ""
                        }`}
                      >
                        <Divider sx={{ borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
                        <ChatCard chat={chat} />
                      </div>
                    ))}

                {query.length === 0 &&
                  chatState.chats?.map((chat: ChatDTO) => (
                    <div
                      key={chat.id}
                      onClick={() => onClickChat(chat)}
                      className={`cursor-pointer ${
                        currentChat?.id === chat.id ? (isDarkMode ? "bg-gray-700" : "bg-indigo-50") : ""
                      }`}
                    >
                      <Divider sx={{ borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
                      <ChatCard chat={chat} />
                    </div>
                  ))}

                {chatState.chats?.length > 0 && (
                  <Divider sx={{ borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }} />
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`${currentChat ? "flex" : "hidden sm:flex"} w-full sm:w-3/5 md:w-2/3 flex-col`}>
          {!currentChat && <WelcomePage reqUser={authState.reqUser} />}
          {currentChat && (
            <MessagePage
              chat={currentChat}
              reqUser={authState.reqUser}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={onSendMessage}
              setIsShowEditGroupChat={setIsShowEditGroupChat}
              setCurrentChat={setCurrentChat}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Homepage


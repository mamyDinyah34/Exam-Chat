import {ChatDTO} from "../../redux/chat/Model";
import {UserDTO} from "../../redux/auth/Model";

export const getInitialsFromName = (name: string): string => {
    if (!name) return "";
    const splitName: string[] = name.split(' ');
    return splitName.length > 1 ? `${splitName[0][0]}${splitName[1][0]}` : splitName[0][0];
};

export const transformDateToString = (date: Date): string => {
    const currentDate = new Date();
    if (date.getFullYear() !== currentDate.getFullYear()) {
        return date.getFullYear().toString();
    }
    if (date.getDate() !== currentDate.getDate()) {
        return getDateFormat(date);
    }

    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return hours + ":" + minutes;
};

export const getChatName = (chat: ChatDTO | undefined | null, reqUser: UserDTO | null): string => {
    if (!chat) return "Chat";
    if (chat.isGroup) return chat.chatName || "Group Chat";
    if (!chat.users || chat.users.length < 2) return "Chat";
    if (reqUser) {
        const otherUserIndex = chat.users[0].id === reqUser.id ? 1 : 0;
        if (chat.users[otherUserIndex]) {
            return chat.users[otherUserIndex].fullName || "User";
        }
    }
    
    return (chat.users[0]?.fullName || "Chat");
};

export const getDateFormat = (date: Date): string => {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() < 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
    return day + '.' + month + '.' + (date.getFullYear());
};
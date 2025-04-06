import {UserDTO} from "../auth/Model";
import {ChatDTO} from "../chat/Model";

export interface MessageDTO {
    id: number;
    content: string;
    timeStamp: string;
    user: UserDTO;
    readBy: number[];
}

export interface WebSocketMessageDTO {
    id: number;
    content: string;
    timeStamp: string;
    user: UserDTO;
    chat: ChatDTO;
}

export interface SendMessageRequestDTO {
    chatId: number;
    content: string;
}

export type MessageReducerState = {
    messages: MessageDTO[];
    newMessage: MessageDTO | null;
}
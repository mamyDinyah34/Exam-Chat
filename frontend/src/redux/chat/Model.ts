import {ApiResponseDTO, UserDTO} from "../auth/Model";
import {MessageDTO} from "../message/Model";

export interface GroupChatRequestDTO {
    userIds: number[];
    chatName: string;
}

export interface ChatDTO {
    id: number;
    chatName: string;
    isGroup: boolean;
    admins: UserDTO[];
    users: UserDTO[];
    createdBy: UserDTO;
    messages: MessageDTO[];
}

export type ChatReducerState = {
    chats: ChatDTO[];
    createdGroup: ChatDTO | null;
    createdChat: ChatDTO | null;
    deletedChat: ApiResponseDTO | null;
    editedGroup: ChatDTO | null;
    markedAsReadChat: ChatDTO | null;
}
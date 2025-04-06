import { BASE_API_URL, AUTHORIZATION_PREFIX } from "../Config";
import * as actionTypes from './ActionType';
import { ChatDTO, GroupChatRequestDTO } from "./Model";
import { AppDispatch } from "../Store";
import { ApiResponseDTO } from "../auth/Model";

const CHAT_PATH = 'api/chats';

const fetchChat = (url: string, token: string, method: string, body?: any) => 
  fetch(`${BASE_API_URL}/${CHAT_PATH}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${AUTHORIZATION_PREFIX}${token}`,
    },
    body: body ? JSON.stringify(body) : undefined
  });

export const createChat = (userId: number, token: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchChat('single', token, 'POST', userId);
    const data: ChatDTO = await res.json();
    dispatch({ type: actionTypes.CREATE_CHAT, payload: data });
  } catch (error) {
    console.error('Create chat failed:', error);
  }
};

export const createGroupChat = (data: GroupChatRequestDTO, token: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchChat('group', token, 'POST', data);
    const resData: ChatDTO = await res.json();
    dispatch({ type: actionTypes.CREATE_GROUP, payload: resData });
  } catch (error) {
    console.error('Create group failed:', error);
  }
};

export const getUserChats = (token: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchChat('user', token, 'GET');
    const data: ChatDTO[] = await res.json();
    dispatch({ type: actionTypes.GET_ALL_CHATS, payload: data });
  } catch (error) {
    console.error('Get chats failed:', error);
  }
};

export const deleteChat = (id: number, token: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchChat(`delete/${id}`, token, 'DELETE');
    const data: ApiResponseDTO = await res.json();
    dispatch({ type: actionTypes.DELETE_CHAT, payload: data });
  } catch (error) {
    console.error('Delete chat failed:', error);
  }
};

export const addUserToGroupChat = (chatId: number, userId: number, token: string) => 
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetchChat(`${chatId}/add/${userId}`, token, 'PUT');
      const data: ChatDTO = await res.json();
      dispatch({ type: actionTypes.ADD_MEMBER_TO_GROUP, payload: data });
    } catch (error) {
      console.error('Add user failed:', error);
    }
  };

export const removeUserFromGroupChat = (chatId: number, userId: number, token: string) => 
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetchChat(`${chatId}/remove/${userId}`, token, 'PUT');
      const data: ChatDTO = await res.json();
      dispatch({ type: actionTypes.REMOVE_MEMBER_FROM_GROUP, payload: data });
    } catch (error) {
      console.error('Remove user failed:', error);
    }
  };

export const markChatAsRead = (chatId: number, token: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchChat(`${chatId}/markAsRead`, token, 'PUT');
    const data: ChatDTO = await res.json();
    dispatch({ type: actionTypes.MARK_CHAT_AS_READ, payload: data });
  } catch (error) {
    console.error('Mark as read failed:', error);
  }
};
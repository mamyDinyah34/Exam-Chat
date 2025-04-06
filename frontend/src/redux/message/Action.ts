import { MessageDTO, SendMessageRequestDTO } from "./Model";
import * as actionTypes from './ActionType';
import { BASE_API_URL, AUTHORIZATION_PREFIX } from "../Config";
import { AppDispatch } from "../Store";

const MESSAGE_PATH = 'api/messages';

const fetchMessage = (url: string, token: string, method: string, body?: any) => 
  fetch(`${BASE_API_URL}/${MESSAGE_PATH}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${AUTHORIZATION_PREFIX}${token}`,
    },
    body: body ? JSON.stringify(body) : undefined
  });

export const createMessage = (data: SendMessageRequestDTO, token: string) => 
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetchMessage('create', token, 'POST', data);
      const message: MessageDTO = await res.json();
      dispatch({ type: actionTypes.CREATE_NEW_MESSAGE, payload: message });
    } catch (error) {
      console.error('Send message failed:', error);
    }
  };

export const getAllMessages = (chatId: number, token: string) => 
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetchMessage(`chat/${chatId}`, token, 'GET');
      const messages: MessageDTO[] = await res.json();
      dispatch({ type: actionTypes.GET_ALL_MESSAGES, payload: messages });
    } catch (error) {
      console.error('Get messages failed:', error);
    }
  };
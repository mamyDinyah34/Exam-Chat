import { 
    LoginResponseDTO, SignUpRequestDTO, LoginRequestDTO, 
    UpdateUserRequestDTO, UserDTO, ApiResponseDTO, 
    AuthenticationErrorDTO 
} from "./Model";
import * as actionTypes from './ActionType';
import { BASE_API_URL, TOKEN, AUTHORIZATION_PREFIX } from "../Config";
import { AppDispatch } from "../Store";

const AUTH_PATH = 'auth';
const USER_PATH = 'api/users';

const fetchWithAuth = (url: string, token: string, options: RequestInit = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            ...options.headers
        }
    });
};

const handleAuthResponse = (resData: LoginResponseDTO, dispatch: AppDispatch, actionType: string) => {
    if (resData.token) {
        localStorage.setItem(TOKEN, resData.token);
    }
    dispatch({ type: actionType, payload: resData });
};

export const register = (data: SignUpRequestDTO) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res = await fetch(`${BASE_API_URL}/${AUTH_PATH}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData: LoginResponseDTO = await res.json();
        handleAuthResponse(resData, dispatch, actionTypes.REGISTER);
    } catch (error) {
        console.error('Register failed:', error);
    }
};

export const loginUser = (data: LoginRequestDTO) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res = await fetch(`${BASE_API_URL}/${AUTH_PATH}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData: LoginResponseDTO = await res.json();
        handleAuthResponse(resData, dispatch, actionTypes.LOGIN_USER);
    } catch (error) {
        console.error('Login failed:', error);
    }
};

export const currentUser = (token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res = await fetchWithAuth(`${BASE_API_URL}/${USER_PATH}/profile`, token, { method: 'GET' });
        const resData: UserDTO | AuthenticationErrorDTO = await res.json();
        
        if ('message' in resData && resData.message === 'Authentication Error') {
            localStorage.removeItem(TOKEN);
            return;
        }
        dispatch({ type: actionTypes.REQ_USER, payload: resData });
    } catch (error) {
        console.error('Fetching current user failed:', error);
    }
};

export const searchUser = (query: string, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res = await fetchWithAuth(`${BASE_API_URL}/${USER_PATH}/search?name=${query}`, token);
        const resData: UserDTO[] = await res.json();
        dispatch({ type: actionTypes.SEARCH_USER, payload: resData });
    } catch (error) {
        console.error('Searching user failed:', error);
    }
};

export const updateUser = (data: UpdateUserRequestDTO, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res = await fetchWithAuth(`${BASE_API_URL}/${USER_PATH}/update`, token, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        const resData: ApiResponseDTO = await res.json();
        dispatch({ type: actionTypes.UPDATE_USER, payload: resData });
    } catch (error) {
        console.error('User update failed:', error);
    }
};

export const logoutUser = () => (dispatch: AppDispatch): void => {
    localStorage.removeItem(TOKEN);
    dispatch({ type: actionTypes.LOGOUT_USER, payload: null });
    dispatch({ type: actionTypes.REQ_USER, payload: null });
};
export interface iMessage {
    author: string, 
    users: string[], 
    date: number, 
    message: string,  
    private: boolean,
    status?: string,
    onclick?: any
}

export const SET_TYPYNG_STATUS = 'SET_TYPYNG_STATUS'
export const GOT_NEW_MESSAGE = 'GOT_NEW_MESSAGE'
export const LOAD_LAST_MESSAGES = 'LOAD_LAST_MESSAGES'
export const LOGIN_USER = 'LOGIN_USER'
export const ADD_RECIPIENT = 'ADD_RECIPIENT'
export const REMOVE_RECIPIENT = 'REMOVE_RECIPIENT'
export const REMOVE_TYPING_STATUS = 'REMOVE_TYPING_STATUS'

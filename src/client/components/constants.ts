export interface iMessage {
    author: string, 
    users: string[], 
    date: number, 
    message: string, 
    status: string, 
    private: boolean,
    onclick?: any
}

export const SET_TYPYNG_STATUS = 'SET_TYPYNG_STATUS'
export const GOT_NEW_MESSAGE = 'GOT_NEW_MESSAGE'
export const LOAD_LAST_MESSAGES = 'LOAD_LAST_MESSAGES'
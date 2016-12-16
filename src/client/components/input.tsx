import * as React from 'react'
import * as io from 'socket.io-client'

import {Style, css} from './input.style'
import {SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, REMOVE_RECIPIENT} from './constants'


interface State {}
interface Props {
    users: string[],
    onDispatch: any
}


export default class Input extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    private placeholder: string
    private input: HTMLInputElement
    private checkbox: HTMLInputElement

    constructor(props: Props) {
        super(props)  
        
        // this.socket = io()
        this.placeholder = 'type here'

    }

    componentDidMount(){
        // get last 10 messages from server

    }

    keyUpHandler = (event: KeyboardEvent) => {
        
        switch(event.key){
            case 'Enter' :
                const message = {
                    message: this.input.value,
                    private: this.checkbox.checked
                }
                this.props.onDispatch(GOT_NEW_MESSAGE, message)
                this.input.value = ''
                break
            default:
                // this.props.onDispatch(SET_TYPYNG_STATUS)
        }    
    }
    focusHandler = (event: FocusEvent) => {
        this.props.onDispatch(SET_TYPYNG_STATUS)
    }
    blurHandler = (event: FocusEvent) => {
        // !! user stops typing
        this.props.onDispatch(SET_TYPYNG_STATUS)
    }
    clickHandler = (user: string) => {
        
        this.props.onDispatch(REMOVE_RECIPIENT,user)
    }

    render() {

        const handlers = {
            onKeyUp: this.keyUpHandler.bind(this),
            onFocus:this.focusHandler.bind(this),
            onBlur: this.blurHandler.bind(this)
        }

        const users = this.props.users.map((usr,idx) => {
        return <span key={idx} onClick={() => this.clickHandler(usr)}>@{usr},</span>
        })

        return (
            <div className={css.input}>
                <div className={css.users}>{users}</div>
                <input type="text" ref={element => this.input = element} 
                     {...handlers} placeholder={this.placeholder}/>
                <input type="checkbox" value="" ref={element => this.checkbox = element} />
                private
                <style>{Style.getStyles()}</style>
            </div>
        )
    }
}

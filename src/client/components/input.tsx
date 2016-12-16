import * as React from 'react'
import * as io from 'socket.io-client'

import {Style, css} from './input.style'
import {SET_TYPYNG_STATUS, GOT_NEW_MESSAGE} from './constants'


interface State {}
interface Props {
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
                    private: this.checkbox.value,
                    author: 'Brodsky'
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

    render() {
        const handlers = {
            onKeyUp: this.keyUpHandler.bind(this),
            onFocus:this.focusHandler.bind(this),
            onBlur: this.blurHandler.bind(this)
        }
        return (
            <div className={css.input}>
                <input type="text" ref={element => this.input = element} 
                     {...handlers} placeholder={this.placeholder}/>
                <input type="checkbox" value="" ref={element => this.checkbox = element} />
                private
                <style>{Style.getStyles()}</style>
            </div>
        )
    }
}

import * as React from 'react'

import {Style, css} from './input.style'
import {SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, REMOVE_RECIPIENT, 
    REMOVE_TYPING_STATUS} from './constants'


interface State {}
interface Props {
    users: string[],
    priv: boolean,
    onDispatch: any
}

export default class Input extends React.Component<Props, State> {

    private placeholder: string
    private input: HTMLInputElement
    private checkbox: HTMLInputElement

    constructor(props: Props) {
        super(props)  
        
        this.placeholder = 'type here'
        
    }
    componentDidMount(){

    }

    componentDidUpdate(){

        // no recipients, no private message
        if(this.props.users.length == 0) {
            this.checkbox.checked = false
            this.checkbox.disabled = true
        } else {
            this.checkbox.disabled = false
            if(this.props.priv) this.checkbox.checked = true
        }
            
    }

    handleKeyUp(event: KeyboardEvent) {
        
        switch(event.key){
            case 'Enter' :
                if(this.input.value == '') return
                this.props.onDispatch(GOT_NEW_MESSAGE,{
                    message: this.input.value,
                    private: this.checkbox.checked
                })
                this.input.value = ''
                break
            default:
                this.props.onDispatch(SET_TYPYNG_STATUS, { 
                    private: this.checkbox.checked , 
                    message: this.input.value
                })
        }    
    }
    handleFocus(event: FocusEvent) {
        const message = {
            private: this.checkbox.checked,
            meaasge: '...'
        }
        this.props.onDispatch(SET_TYPYNG_STATUS, message)
    }

    handleBlur(event: FocusEvent) {
        // !! user stops typing
        this.props.onDispatch(REMOVE_TYPING_STATUS)
    }

    handleClick(user: string) {
        
        this.props.onDispatch(REMOVE_RECIPIENT,user)
    }

    render() {

        const handlers = {
            onKeyUp: this.handleKeyUp.bind(this),
            onFocus: this.handleFocus.bind(this),
            onBlur:  this.handleBlur.bind(this)
        }

        const users = this.props.users.map((usr,idx) => {
            return <span key={idx} onClick={() => this.handleClick(usr)}>@{usr},</span>
        })

        return (
            <div className={css.input}>
                <div className={css.users}>{users}</div>
                <input type="text" ref={element => this.input = element} 
                     {...handlers} placeholder={this.placeholder}/>
                <input type="checkbox" ref={element => this.checkbox = element} />
                private
                <style>{Style.getStyles()}</style>
            </div>
        )
    }
}

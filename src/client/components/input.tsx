import * as React from 'react'

import {SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, REMOVE_RECIPIENT, 
    REMOVE_TYPING_STATUS, SHOW_USER_MENU, HIDE_USER_MENU} from './constants'


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
    private usermenu: boolean

    constructor(props: Props) {
        super(props)  
        
        this.usermenu = false
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
        this.props.onDispatch(HIDE_USER_MENU)
        this.props.onDispatch(SET_TYPYNG_STATUS, message)
    }

    handleBlur(event: FocusEvent) {
        // !! user stops typing
        this.props.onDispatch(REMOVE_TYPING_STATUS)
    }

    handleClick(user: string) {
        
        this.props.onDispatch(REMOVE_RECIPIENT,user)
    }

    handleSubmit() {
        this.usermenu = false
        this.props.onDispatch(HIDE_USER_MENU)
        if(this.input.value == '') return
        this.props.onDispatch(GOT_NEW_MESSAGE,{
            message: this.input.value,
            private: this.checkbox.checked
        })
        this.input.value = ''
    }
    handleUserMenu() {
        if(this.usermenu){
            this.props.onDispatch(HIDE_USER_MENU, null)    
            this.usermenu = false
        } else {
            this.props.onDispatch(SHOW_USER_MENU, null)
            this.usermenu = true
        }
        
    }

    render() {

        const handlers = {
            onKeyUp: this.handleKeyUp.bind(this),
            onFocus: this.handleFocus.bind(this),
            onBlur:  this.handleBlur.bind(this)
        }

        const users = this.props.users.map((usr,idx) => {
            return <span key={idx} style={{color: '#999'}} onClick={() => this.handleClick(usr)}>&nbsp;@{usr},</span>
        })

        return (
            <div className="input">
                <div className='bg-warning h6 pointer'>{users}</div>
                <div className="input-group">
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" 
                            onClick={this.handleUserMenu.bind(this)}>
                            <i className="fa fa-user-plus" aria-hidden="true"></i>
                        </button>
                    </span>
                    <input type="text" className="form-control" ref={elmt => this.input=elmt} 
                        {...handlers} aria-label="chat input" />
                    <span className="input-group-addon">
                        <input type="checkbox" aria-label="private" ref={elmt => this.checkbox = elmt}/>
                    </span>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" 
                            onClick={this.handleSubmit.bind(this)}>Sumbit</button>
                    </span>
                </div>
            </div>
        )
    }
}

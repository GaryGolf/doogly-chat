import * as React from 'react'
import * as io from 'socket.io-client'

import {LOGIN_USER} from './constants'


interface State {}
interface Props { onDispatch: any }

export default class Login extends React.Component<Props, State> {

    private placeholder: string
    private input: HTMLInputElement

    constructor(props: Props) {
        super(props)  
    }

    componentDidMount(){
        const nickname = localStorage['nickname'] || ''
        this.input.focus()
        this.input.value = nickname
    }

    handleKeyUp(event: KeyboardEvent) {
        
        switch(event.key){
            case 'Enter' :
                const name =  this.input.value
                if(name == '') return
                this.props.onDispatch(LOGIN_USER, name)
                localStorage['nickname'] = name
                break
            default :
        }   
    }
    handleSubmit(){
        const name =  this.input.value
        if(name == '') return
        this.props.onDispatch(LOGIN_USER, name)
        localStorage['nickname'] = name
    }

    render() {
       
        return (

            <div className="form-group login-form">
                <div className="input-group">
                    <div className="input-group-addon">Login</div>
                    <input className="form-control" type="text" 
                        onKeyUp={this.handleKeyUp.bind(this)} 
                        ref={elmt => this.input=elmt} 
                        placeholder="Enter Your Nickname" />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" 
                            onClick={this.handleSubmit.bind(this)}>
                            Sumbit
                        </button>
                    </span>
                </div>
            </div>
        )
    }
}

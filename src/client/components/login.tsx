import * as React from 'react'
import * as io from 'socket.io-client'

import {Style, css} from './login.style'
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

    render() {
        return (
            <div className={css.login}>
                <input type="text" ref={element => this.input = element} 
                    onKeyUp={this.handleKeyUp.bind(this)} placeholder="enter you nickname"/>
                <style>{Style.getStyles()}</style>
            </div>
        )
    }
}

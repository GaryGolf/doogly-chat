/// <reference path="./socket.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as io from 'socket.io-client'

import { iMessage, SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, LOAD_LAST_MESSAGES,
    LOGIN_USER, ADD_RECIPIENT, REMOVE_RECIPIENT
    } from './components/constants'

import MessageList from './components/messagelist'
import Input from './components/input'
import Login from './components/login'


interface Props {}
interface State {
    list: iMessage[],
    login: boolean
}

class DooglyChat extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    private name: string
    private users: string[]

    constructor(props: Props) {
        super(props)  
        
        this.socket = Window.prototype.socket = io()
        this.users = []
        
        const list: iMessage[] = []
        const login = false
        this.state = {list, login }
    }

    componentWillMount() {
        this.socket.emit('LoadMessages', null)
        this.socket.on('LoadMessages', (list: iMessage[]) => {
            this.setState({...this.state, list})
        })
        this.socket.on('NewMessage', (message: iMessage) => {
            const list = [...this.state.list, message]
            this.setState({...this.state, list})
        })
    }

    dispatch = (action: string, payload?: any) => {
        switch(action){
            case LOGIN_USER :
                this.socket.emit('Login', payload)
                this.name = payload
                this.setState({...this.state, login: false})
                break
            case GOT_NEW_MESSAGE :
                console.log(payload)
                this.socket.emit('NewMessage', {...payload, users: this.users})
                break
            case ADD_RECIPIENT :
                if(!this.name) this.setState({...this.state, login: true})
                if(this.users.indexOf(payload) != -1 || this.name == payload) break
                this.users.push(payload)
                this.forceUpdate()
                break
            case REMOVE_RECIPIENT :
                this.users = this.users.filter(user => user != payload)
                this.forceUpdate()
                break
            case SET_TYPYNG_STATUS :
                // if user is not logged in 
                if(!this.name) this.setState({...this.state, login: true})
                console.log('typing')
                break
            default:
                break
        }
    }
  
    render(){
        
        if(this.state.login) return <Login onDispatch={this.dispatch} />
        return (
            <div>
                <MessageList list={this.state.list}
                    onDispatch={this.dispatch}/>
                <Input users={this.users} 
                    onDispatch={this.dispatch}/>
            </div>
        )
    }
}

ReactDOM.render(<DooglyChat/>, document.getElementById('layout'))

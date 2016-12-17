/// <reference path="./socket.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as io from 'socket.io-client'

import { iMessage, SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, LOAD_LAST_MESSAGES,
    LOGIN_USER, ADD_RECIPIENT, REMOVE_RECIPIENT, REMOVE_TYPING_STATUS
    } from './components/constants'

import MessageList from './components/messagelist'
import Input from './components/input'
import Login from './components/login'


interface Props {}
interface State {
    list: iMessage[]
}

class DooglyChat extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    private name: string
    private users: string[]
    private login: boolean


    constructor(props: Props) {
        super(props)  
        
        this.socket = Window.prototype.socket = io()
        this.users = []
        this.login = false

        const list: iMessage[] = []
        this.state = {list}
    }

    componentWillMount() {
        // initial message load
        this.socket.emit('LoadMessages', null)
        this.socket.on('LoadMessages', (list: iMessage[]) => {
            this.setState({...this.state, list})
        })

        this.socket.on('NewMessage', (message: iMessage) => {
            const list = [...this.state.list, message]
            this.setState({...this.state, list})
            // notify author that message has received
            this.socket.emit('MessageReceived', message.date)
        })

        this.socket.on('ChangeLoginName', (name: string) => {
            console.log(name)
            this.login = true
            this.forceUpdate()
        })

        this.socket.on('MessageReceived', (date: number) => {
            const list = this.state.list.map(msg => {
                if(msg.date == date) 
                    switch(msg.status) {
                        case 'sent' :
                        return {...msg, status: 'received'}
                        case 'received' :
                        // return {...msg, status: 'read'}
                        default :
                    }
                return msg
            })
            this.setState({...this.state, list})
        })
    }

    dispatch = (action: string, payload?: any) => {
        switch(action){
            case LOGIN_USER :
                this.socket.emit('Login', payload)
                this.name = payload
                this.login = false
                this.forceUpdate()
                break
            case GOT_NEW_MESSAGE :
                const users = this.users
                this.socket.emit('NewMessage', {...payload, users},
                 (message: iMessage) => {
                    if(message)  {
                        const list = [...this.state.list, message]
                        this.setState({...this.state, list})
                    }
                })
                break
            case ADD_RECIPIENT :
                if(!this.name) {
                    this.login = true
                    this.forceUpdate()
                    break
                }
                // should get iMessage
                // if message private new message should be private
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
                if(!this.name) { 
                    this.login = true
                    this.forceUpdate()
                    break
                }
                const message = {
                    private: payload,
                    users: this.users
                } 
                // this.socket.emit('Typing', message)
                break
            case REMOVE_TYPING_STATUS :
                // this.socket.emit('RemoveTyping')
                break
            default:
                break
        }
    }
  
    render(){
        
        if(this.login) return <Login onDispatch={this.dispatch} />
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

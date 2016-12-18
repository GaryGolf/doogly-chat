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
import UserList from './components/userlist'


interface Props {}
interface State {
    // messages
    list: iMessage[],
    // login mode switch
    login: boolean,
    // chat clients
    users: string[]
}

class DooglyChat extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    private name: string
    private users: string[]
    private typing: iMessage


    constructor(props: Props) {
        super(props)  
        
        this.socket = Window.prototype.socket = io()
        this.users = []

        const list: iMessage[] = []
        const login: boolean = false
        const users: string[] = []
        this.state = {list , login, users}

    }

    componentWillMount() {
        
         this.socket.on('user_login', (name: string) => {
            const users = [...this.state.users, name]
            this.setState({...this.state, users})
        })

        this.socket.on('user_logout', (name: string) => {
            const users = this.state.users.filter(usr => usr != name)
            this.setState({...this.state, users})
        })

        this.socket.on('new_message', (message: iMessage) => {
            const list = [...this.state.list, message]
            this.setState({...this.state, list})
            // notify author that message has received
            this.socket.emit('MessageReceived', message.date)
        })

        this.socket.on('remove_message', (date: number) => {
            console.log('remove_message')
            const list = this.state.list.filter(msg => msg.date != date)
            this.setState({...this.state, list})
        })

        // this nickname is already exist
        this.socket.on('ChangeLoginName', (name: string) => {
            this.setState({...this.state, login: true})
        })

        this.socket.on('MessageReceived', (date: number) => {
            const list = this.state.list.map(msg => {
                if(msg.date == date) 
                    switch(msg.status) {
                        case 'sent' :
                        return {...msg, status: 'received'}
                        case 'received' :
                        default :
                    }
                return msg
            })
            this.setState({...this.state, list})
        })

    
    }

    componentDidMount(){
        // initial messages and users load
        this.socket.emit('init', null, 
            (list: iMessage[], users: string[]) =>{
                this.setState({...this.state, list, users})
        })
    }



    dispatch = (action: string, payload?: any) => {

        switch(action){

            case LOGIN_USER :
                this.socket.emit('login_user', payload,
                    (ok: boolean, list: iMessage[]) => {
                        if(ok) { 
                            this.name = payload
                            this.setState({...this.state, list, login: false})
                        } else { 
                            this.setState({...this.state, login: true})
                        }
                })
                break
            case GOT_NEW_MESSAGE :
                const users = this.users
                this.socket.emit('new_message', {...payload, users},
                 (message: iMessage) => {
                    if(message)  {
                        const list = [...this.state.list, message]
                        this.setState({...this.state, list})
                    }
                })
                break
            case ADD_RECIPIENT :
                if(!this.name) {
                    this.setState({...this.state, login: true})
                    break
                }
                // should get iMessage
                // if message private new message should be private
                if(this.users.indexOf(payload.user) != -1 || 
                    this.name == payload.user) break
                this.users.push(payload.user)
                this.forceUpdate()
                break
            case REMOVE_RECIPIENT :
                this.users = this.users.filter(user => user != payload)
                this.forceUpdate()
                break
            case SET_TYPYNG_STATUS :
                // if user is not logged in 
                if(!this.name) { 
                    this.setState({...this.state, login: true})
                    break
                }
                
                payload.users = this.users,
                this.socket.emit('typing', payload, (typing: iMessage) => {
                    this.typing = typing
                })
                break
            case REMOVE_TYPING_STATUS :
                console.log('cancel_typing')
                this.socket.emit('cancel_typing')
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
                <UserList list={this.state.users} onDispatch={this.dispatch}/>
            </div>
        )
    }
}

ReactDOM.render(<DooglyChat/>, document.getElementById('layout'))

/// <reference path="./socket.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as io from 'socket.io-client'

import { iMessage, SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, LOAD_LAST_MESSAGES,
    LOGIN_USER, ADD_RECIPIENT, REMOVE_RECIPIENT, REMOVE_TYPING_STATUS, 
    SHOW_USER_MENU, HIDE_USER_MENU
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
    users: string[],

    showusers: boolean
}

class DooglyChat extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    private name: string
    private users: string[]
    private priv: boolean


    constructor(props: Props) {
        super(props)  
        
        this.socket = Window.prototype.socket = io()
        this.users = []
        this.priv = false

        const list: iMessage[] = []
        const login: boolean = false
        const users: string[] = []
        const showusers = false
        this.state = {list , login, users, showusers}

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
            this.socket.emit('message_received', message.date)
        })

        this.socket.on('update_message', (message: iMessage) => {
            var list = this.state.list.filter(msg => msg.date != message.date)
            list.push(message)
            this.setState({...this.state, list})
        })

        this.socket.on('remove_message', (date: number) => {
            const list = this.state.list.filter(msg => msg.date != date)
            this.setState({...this.state, list})
        })

        this.socket.on('message_received', (date: number) => {
            const list = this.state.list.map(msg => {
                if(msg.date == date) 
                    switch(msg.status) {
                        case 'sent' :
                            return {...msg, status: 'received'}
                        case 'received' :
                            return {...msg, status: 'read'}
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
                // should i send reading notifications here?
                list.forEach(msg => {
                    this.socket.emit('message_received', msg.date)
                })
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
                this.socket.emit('cancel_typing')
                this.socket.emit('new_message', {...payload, users},
                 (message: iMessage) => {
                    if(message)  {
                        let list = this.state.list.map(m => m)
                        // remove last message           
                        list.pop()
                        list.push(message)
                        this.setState({...this.state, list})
                    }
                })
                // push message with status sending
                const date = Date.now()
                const status = 'sending'
                const list: iMessage[] = [...this.state.list,{...payload, users, date, status}]
                this.setState({...this.state, list})
                break

            case ADD_RECIPIENT :
                if(!this.name) {
                    this.setState({...this.state, login: true})
                    break
                }
                if(this.users.indexOf(payload.user) != -1 || 
                    this.name == payload.user) break
                this.users.push(payload.user)
                // if message private new message should be private
                if(payload.private) this.priv = true           
                this.forceUpdate()
                break

            case REMOVE_RECIPIENT :
                this.users = this.users.filter(user => user != payload)
                if(this.users.length == 0) this.priv = false
                this.forceUpdate()
                break

            case SET_TYPYNG_STATUS :
                // if user is not logged in 
                if(!this.name) { 
                    this.setState({...this.state, login: true})
                    break
                }
                this.socket.emit('typing', {...payload, users: this.users })
                break

            case REMOVE_TYPING_STATUS :
                this.socket.emit('cancel_typing')
                break
            case SHOW_USER_MENU :
                if(!this.name) { 
                    this.setState({...this.state, login: true})
                    break
                }
                this.setState({...this.state,showusers: true})
                break
            case HIDE_USER_MENU :
                this.setState({...this.state,showusers: false})
                break
            default:
                break
        }
    }
  
    render(){
        

        if(this.state.login) return (
          <div className="container">   
            <Login onDispatch={this.dispatch} />
          </div>
        )

        return (
            <div className="container">
                <MessageList list={this.state.list} name={this.name}
                    onDispatch={this.dispatch}/>
                <Input users={this.users}
                    onDispatch={this.dispatch} priv={this.priv}/>
                
                <UserList list={this.state.users} showusers={this.state.showusers} onDispatch={this.dispatch}/>
            </div>
        )
    }
}

ReactDOM.render(<DooglyChat/>, document.getElementById('layout'))

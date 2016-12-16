/// <reference path="./socket.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as io from 'socket.io-client'

import {iMessage, SET_TYPYNG_STATUS, GOT_NEW_MESSAGE, LOAD_LAST_MESSAGES} from './components/constants'
// import Message from './components/message'
import MessageList from './components/messagelist'
import Input from './components/input'


interface Props {}
interface State {
    list: iMessage[]
}

class DooglyChat extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    constructor(props: Props) {
        super(props)  
        
        this.socket = Window.prototype.socket = io()
        const list: iMessage[] = []
        this.state = {list}
    }

    componentWillMount() {
        this.socket.emit('LoadMessages', null)
        this.socket.emit('Login', 'Max Lancaster')
        
        this.socket.on('LoadMessages', (list: iMessage[]) => {
            this.setState({list})
        })
        this.socket.on('NewMessage', (message: iMessage) => {
            const list = [...this.state.list, message]
            this.setState({list})
        })
    }

    dispatch = (action: string, payload?: any) => {
        switch(action){
            case LOAD_LAST_MESSAGES :

                break
            case GOT_NEW_MESSAGE :
                this.socket.emit('NewMessage', {...payload, users: []})
                break
            case SET_TYPYNG_STATUS :
                console.log('typing')
                break
            default:
                break
        }
    }
  
    render(){
       
        return (
            <div>
                <MessageList list={this.state.list}/>
                <Input onDispatch={this.dispatch}/>
            </div>
        )
    }
}

ReactDOM.render(<DooglyChat/>, document.getElementById('layout'))

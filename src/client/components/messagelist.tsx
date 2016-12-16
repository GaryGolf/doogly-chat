import * as React from 'react'
import * as io from 'socket.io-client'
import {iMessage} from './constants'
import Message from './message'
import {Style, css} from './messagelist.style'


interface State {}
interface Props {
    list: iMessage[]
}


export default class MessageList extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket

    constructor(props: Props) {
        super(props)  
        
        // this.socket = io()
    }

    componentWillMount(){
        // get last ten messages from server
       
        // console.log('will')
        // this.socket.emit('chat message', 'hello')
        // this.socket.on('chat message', (msg: string) => {
        //     console.log(msg)
        // })
    }

    componentDidMount(){
        // // get last 10 messages from server
        // this.socket.emit('get last 10 messages',null)
        // this.socket.on('get last 10 messages', (list: MessageInterface[]) => {
        //     this.setState({list})
        // })
        // // get new message
        // this.socket.on('new message', (message: MessageInterface) => {
        //     let list: MessageInterface[] = []
        //     //if there is some message with this id, replace it
        //     this.state.list.forEach((msg, idx) => {
        //         if(msg.id == message.id) {
        //             list = [...this.state.list]
        //             list[idx] = message
        //             this.setState({list})
        //             return
        //         }
        //     })
        //     //else push message to list
        //     list = [...this.state.list, message]
        //     this.setState({list})
        // })

    }

    clickHandler(author: string) {
        console.log(author)
    }


    render() {
        const list = this.props.list.map((msg, idx) => {
            msg.onclick = this.clickHandler.bind(this)
            return <div key={idx}><Message {...msg}/></div>
        })
        return (
            <div className={css.messagelist}>
                {list}
            </div>
        )
    }
}

import * as React from 'react'
import * as io from 'socket.io-client'

import {Style, css} from './message.style'


interface State {}
interface Props { 
    author: string, 
    users: string[], 
    date: number, 
    message: string, 
    status: string, 
    private: boolean,
    onclick: any
 }


export default class Message extends React.Component<Props, State> {

    private socket: SocketIOClient.Socket
    private message: JSX.Element

    constructor(props: Props) {
        super(props)  
        
        // this.socket = io()
        if(props.message.length < 30) this.message =  <span>{props.message}</span> 
        else  this.message = (
            <span>{this.props.message.substr(0,30)+' ... '}<span className={css.more} 
            onClick={this.moreHandler.bind(this)}>more</span></span>
        )
    }

    componentWillMount(){
        // console.log('will')
        // this.socket.emit('chat message', 'hello')
        // this.socket.on('chat message', (msg: string) => {
        //     console.log(msg)
        // })
    }

    clickHandler(event: MouseEvent) {
        this.props.onclick(this.props.author)
    }

    moreHandler(event: MouseEvent) {
        event.stopPropagation()
        this.message = <span>{this.props.message}</span>
        this.forceUpdate() 
    }

    render() {

        const users = this.props.users.map(user => '@'+user).join(',')
        const date = new Date(this.props.date)
        const time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
            
        return (
            <div className={css.message} onClick={this.clickHandler.bind(this)}>
                <header>
                    <span className={css.author}>{this.props.author}</span>
                    <span>{this.props.status}</span>&nbsp;&nbsp;
                    <span>{time}</span>
                </header>
                <div>
                    <span className={css.users}>{users}</span>&nbsp;&nbsp;
                    {this.message}
                </div>
                   <style>{Style.getStyles()}</style>
            </div>
        )
    }
}
    
import * as React from 'react'
import * as io from 'socket.io-client'
import {iMessage, ADD_RECIPIENT} from './constants'
import Message from './message'
import {Style, css} from './messagelist.style'


interface State {}
interface Props {
    list: iMessage[],
    onDispatch: any
}


export default class MessageList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)  
    }

    handleClick(author: string, priv: boolean){

        this.props.onDispatch(ADD_RECIPIENT, {author, private:priv})
    }

    drawMessage(message: iMessage) {
        
        const date = new Date(message.date)
        const time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
        const users = message.users.map((usr, idx) => {
            return <span key={idx} onClick={() => this.handleClick(message.author, 
                message.private)}>@{usr},</span>
        })

        return (
            <div className={css.message}>
                <div className={css.body} onClick={() => this.handleClick(message.author, 
                        message.private)}>{message.message}</div>
                <div className={css.details}>
                    <span>{time}</span>&nbsp;&nbsp;
                    <span className={css.author}>{message.author}</span>&nbsp;&nbsp;
                    <span className={(message.private) ? css.private : css.users}>{users}</span>&nbsp;&nbsp;
                    <span>{message.status}</span>&nbsp;&nbsp;
                </div>
                <style>{Style.getStyles()}</style>
            </div>
        )
    }

    render() {

        const list = this.props.list.map((msg, idx) => <div key={idx}>{this.drawMessage(msg)}</div>)

        return <div className={css.messagelist}>{list}</div>
    }
}

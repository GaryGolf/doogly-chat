import * as React from 'react'

import {iMessage, ADD_RECIPIENT, HIDE_USER_MENU} from './constants'

interface State {}
interface Props {
    list: iMessage[],
    name: string,
    onDispatch: any
}


export default class MessageList extends React.Component<Props, State> {

    private messagelist: HTMLDivElement

    constructor(props: Props) {
        super(props)  
    }

    componentDidUpdate(){
        const last = this.messagelist.children.length -1
        this.messagelist.children.item(last).scrollIntoView()
    }

    handleClick(user: string, priv: boolean){

        this.props.onDispatch(ADD_RECIPIENT, {user, private:priv})
    }

    handleUserMenu() {
        this.props.onDispatch(HIDE_USER_MENU)
    }

    drawMessage(message: iMessage) {
        
        const date = new Date(message.date)
        const time = date.toLocaleTimeString()
        const users = message.users.map((usr, idx) => {
            return <span key={idx} onClick={() => this.handleClick(usr, 
                message.private)}>@{usr},&nbsp;</span>
        })

        return (
            <div className={`well ${this.props.name == message.author ? 'text-right' : null}`}
                onClick={this.handleUserMenu.bind(this)}>

                <div className='message h4 pointer' 
                    onClick={() => this.handleClick(message.author, message.private)}>
                    {message.message}
                </div>

                <div className='small'>
                    <span>{time}&nbsp;</span>
                    <span className={this.props.name == message.author ? 'hidden':'pointer'} 
                        onClick={() => this.handleClick(message.author,message.private)}>
                        <strong>{message.author}</strong>&nbsp;
                    </span>
                    <span className={(message.private) ? 'text-danger pointer':'text-info pointer'}>
                        {users}&nbsp;
                    </span>
                    <span>{message.status}</span>
                </div>
            </div>
        )
    }

    render() {

        const list = this.props.list.map((msg, idx) => <div key={idx}>{this.drawMessage(msg)}</div>)

        return <div className='messagelist' ref={element => this.messagelist = element}>{list}</div>
    }
}

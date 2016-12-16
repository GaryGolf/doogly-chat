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

   

    clickHandler(author: string) {
        this.props.onDispatch(ADD_RECIPIENT, author)
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

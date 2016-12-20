import * as React from 'react'

import {iMessage, ADD_RECIPIENT, HIDE_USER_MENU} from './constants'

interface State {}
interface Props {
    list: string[],
    showusers: boolean,
    onDispatch: any
}


export default class UserList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)  
    }

   

    handleClick(user: string) {
        this.props.onDispatch(HIDE_USER_MENU)
        this.props.onDispatch(ADD_RECIPIENT,{user})
    }   
    hanldeClose(){
        this.props.onDispatch(HIDE_USER_MENU)
    }

    render() {
        
        const list = this.props.list.map((usr, idx) => 
            <div key={idx} className="pointer" onClick={() => this.handleClick(usr)}>{usr}</div>)
        
        return (<div className={this.props.showusers ? 'show-userlist' : 'userlist'}>
                    <button type="button" className="close" 
                        onClick={this.hanldeClose.bind(this)}>
                        <span aria-hidden="true">&times;</span>
                        <span className="sr-only">Close</span>
                    </button>
                    {list}
                </div>)
    }
}

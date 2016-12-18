import * as React from 'react'

import {iMessage, ADD_RECIPIENT} from './constants'
import {Style, css} from './userlist.style'


interface State {}
interface Props {
    list: string[],
    onDispatch: any
}


export default class UserList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)  
    }

   

    handleClick(user: string) {
        this.props.onDispatch(ADD_RECIPIENT,{user})
    }

    render() {
        
        const list = this.props.list.map((usr, idx) => 
            <div key={idx} onClick={() => this.handleClick(usr)}>{usr}</div>)
        
        return (<div className={css.userlist}>
                    {list}
                    <style>{Style.getStyles()}</style>
                </div>)
    }
}

import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    message: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',
        // display: 'table-cell',
        // verticalAlign: 'middle',
        padding: '10px',
        width: '100%'
    }),
    author: Style.registerStyle({ 
        marginRight: '50px',
        fontSize: '2rem',
        cursor: 'pointer'        
    }),
    users: Style.registerStyle({ 
        color: 'blue'
    }),
    more: Style.registerStyle({ 
        color: 'blue',
        cursor: 'pointer'
    }),


}
import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    message: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',
        padding: '10px',
        width: '100%'
    }),
    body: Style.registerStyle({ 
        // marginRight: '50px',
        fontSize: '1.2rem',
        cursor: 'pointer'        
    }),
    details: Style.registerStyle({ 
        // marginRight: '50px',
        fontSize: '.75rem',
        cursor: 'pointer'        
    }),
    author: Style.registerStyle({ 
    }),
    private: Style.registerStyle({ 
        color: 'red',
    }),
    users: Style.registerStyle({ 
        color: 'blue'
    }),
    more: Style.registerStyle({ 
        color: 'blue',
        cursor: 'pointer'
    }),


}
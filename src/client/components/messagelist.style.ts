import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    messagelist: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',  
        padding: '10px',
        width: '100%',
        height: '70%',
        overflow: 'auto'
    }),
    
     message: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',
        padding: '10px',
        width: '100%',
    }),

    body: Style.registerStyle({ 
        paddingBottom: '6px',
        fontSize: '1.2rem',
        cursor: 'pointer'        
    }),

    details: Style.registerStyle({ 
        fontSize: '.9rem',
        cursor: 'pointer'        
    }),

    author: Style.registerStyle({ 
        fontWeight: 'bold'
    }),

    private: Style.registerStyle({ 
        color: 'red'
    }),

    users: Style.registerStyle({ 
        color: 'blue'
    }),

    more: Style.registerStyle({ 
        color: 'blue',
        cursor: 'pointer'
    })
}
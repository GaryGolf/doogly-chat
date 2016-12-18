import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    input: Style.registerStyle({
        position: 'absolute',
        borderSize: 'border-box',  
        minWidth: '280px',
        padding: '3px',
        bottom: '10px'
    }),
    users: Style.registerStyle({
       fontSize: '0.7rem',
       color: 'blue',
       cursor: 'pointer'
    })
}
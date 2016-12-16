import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    messagelist: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',  
        padding: '10px',
        width: '100%',
        height: '100%'
    }),
}
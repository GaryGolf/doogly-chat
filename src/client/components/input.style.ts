import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    input: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',  
        padding: '10px',
        bottom: '0px'
    }),
}
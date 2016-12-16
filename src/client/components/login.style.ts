import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    login: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',  
        padding: '10px'
    }),
}
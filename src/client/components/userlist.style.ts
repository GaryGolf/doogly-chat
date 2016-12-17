import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    userlist: Style.registerStyle({
        position: 'relative',
        borderSize: 'border-box',
        float: 'left',
        padding: '10px',
        width: '10%'
    })
}
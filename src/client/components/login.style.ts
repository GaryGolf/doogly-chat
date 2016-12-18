import * as FreeStyle from 'free-style'


export const Style = FreeStyle.create()

export const css = {

    login: Style.registerStyle({
        '.form-group': {},
        position: 'relative',
        borderSize: 'border-box',  
        width: '200px',
        margin: 'auto',
        marginTop: '10%',
        textAlign: 'center',
        padding: '10px'
    }),
}
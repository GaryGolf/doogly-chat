const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const users = require('./src/server/users')
const messages = require('./src/server/messages')

const port = process.env.PORT || 8080
const app = express()

const server = http.createServer(app)
const io = socketio(server)


server.listen(port, () => {
    console.log('http server started at port ' + port)
})

io.on('connection', socket => {
    
    socket.on('LoadMessages', (msg) => {
        const list = messages.getLastMessages()
        socket.emit('LoadMessages', list)
    })

    socket.on('Login', (name) => {
        // if name already exist choose another one
        if(!users.login(socket.id, name)){
            socket.emit('ChangeLoginName', name)   
            return 
        }
        const list = messages.getLastMessages(name)
        socket.emit('LoadMessages', list)
    })

    socket.on('Logout', () => {
        users.logout(socket.id)
    })

    socket.on('NewMessage', (message, callback) => {
        
        message.date = Date.now()
        message.author = users.getName(socket.id)

        messages.push(message)

        if(message.private){
            message.users.forEach(usr => {
                const room = users.getId(usr)
                if(room) io.to(room).emit('NewMessage', message)
            })
        } else socket.broadcast.emit('NewMessage', message)

        message.status = 'sent'
        callback(message)
    })

    socket.on('MessageReceived', (date) => {
        // find message
        const message = messages.getMessage(date)
        // find author
        const id = users.getId(message.author)
        // send notification abt changing status
        socket.to(id).emit('MessageReceived', date)
    })

    socket.on('Typing', (message) => {
        
      
    })
})

app.use(express.static(path.join(__dirname,'public')))
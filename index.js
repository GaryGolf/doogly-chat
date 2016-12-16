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
        //console.log(io.clients().connected)
    })

    socket.on('Login', (name) =>{
        users.login(socket.id, name)
        console.log(users.getId(name))
        const list = messages.getLastMessages(name)
        socket.emit('LoadMessages', list)
    })

    socket.on('Logout', () => {
        users.logout(socket.id)
    })

    socket.on('NewMessage', (message) => {
        
        message.author = users.getName(socket.id)
        if(!message.author) return // not found
        message.date = Date.now()
        message.status = 'sent'
        messages.push(message)

        if(message.private){
            message.users.forEach(usr => {
                const room = users.getId(usr)
                if(room) io.to(room).emit('NewMessage', message)
            })
        } else {
            socket.broadcast.emit('NewMessage',message)
        }
         socket.emit('NewMessage', message)
    })

    socket.on('MessageReceived', (date) => {
        socket.broadcast.emit('MessageReceived', date)
    })

    socket.on('Typing', (message) => {
        
      
    })
})

app.use(express.static(path.join(__dirname,'public')))
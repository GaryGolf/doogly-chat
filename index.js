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
    
    socket.on('init', (msg, callback) => {  
        callback(messages.getLastMessages(), users.getNames())
    })
    
    socket.on('login_user', (name, callback) => {
        // if name already exist send error
        const ok = users.login(socket.id, name)
        const list = messages.getLastMessages(name)
        callback(ok, list)
        socket.broadcast.emit('user_login', name)
    })

    socket.on('disconnect',() => {
        const name = users.getName(socket.id)
        socket.broadcast.emit('user_logout', name)
        users.logout(socket.id)
    })

    socket.on('new_message', (message, callback) => {
        
        message.date = Date.now()
        message.author = users.getName(socket.id)

        messages.push(message)

        if(message.private){
            message.users.forEach(usr => {
                const room = users.getId(usr)
                if(room) io.to(room).emit('new_message', message)
            })
        } else socket.broadcast.emit('new_message', message)

        message.status = 'sent'
        callback(message)
    })

    socket.on('typing', (message, callback) => {


        if(!users.getName(socket.id)) {
            callback(message)
            return
        }
        if(message.date) {
           callback(messages.getMessage(message.date))
           return
        } 
        message.date = Date.now()
        message.author = users.getName(socket.id)
        message.message = 'typing...'
        message.status = 'typing'
        messages.push(message)

        if(message.private){
            message.users.forEach(usr => {
                const room = users.getId(usr)
                if(room) io.to(room).emit('new_message', message)
            })
        } else socket.broadcast.emit('new_message', message)

        callback(message)
    })

    socket.on('cancel_typing', () => {
        // who
        const user = users.getName(socket.id)
        // is there typing message ?
        const message = messages.getTypingMessage(user)
        
        if(message) {
            socket.broadcast.emit('remove_message', message.date)
            messages.removeMessage(message.date)
        }
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
const users = require('./users')
var messages  = [
            {
                author: 'Владимир',
                users: ['Антон'],
                date: 1481877130452,
                message: 'Привет',
                private: false
            }
        ]

exports.getLastMessages = function(name) {

    return messages.filter((msg, idx) => {
        if(idx < messages.length - 10) return false
        if(msg.private) {
            if(name) {
                if(msg.name == name || msg.users.indexOf(name) != -1) return true
            }
            return false
        }
        return true
    })
}

exports.push = function(message) {
    if(messages.some(msg => msg.date == message.date)){
        messages.forEach((msg,idx) => {
            if(msg.date == message.date) { 
                messages[idx] = message 
                return
            }
            console.log(idx)
        })
    } else {
        messages.push(message)
    } 
}
exports.getMessage = function(date) {
    return messages.find(msg => msg.date == date)
}

exports.getTypingMessage = function(name){
    return messages.find(msg => msg.author == name && msg.status == 'typing')
}

exports.removeMessage = function(date){
    messages = messages.filter(msg => msg.date != date)
}

exports.updateMessage = function(message) {
    const idx = messages.findIndex(msg => msg.date == message.date)
    messages[idx] = message
}

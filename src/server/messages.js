const users = require('./users')
const  messages  = [
            {
                author: 'Boris Brodsky',
                users: ['Nastya','Max Lancaster'],
                date: 1481877130452,
                message: 'Конечно, мы бы хотели получить от вас в ответ на это тестовое задание 100% реализацию требований, но это вовсе не обязательно, если вы понимаете, что охватить весь предложенный функционал в разумные сроки у вас не получится (в виду любых возможных обстоятельств), выберите комфортный для вас набор из списка требований — уверяем, это никаких не скажется на конечной оценке задания;',
                private: true
            },
            {
                author: 'Boris Brodsky',
                users: [],
                date: 1481877140452,
                message: 'Let\'s go out, guys',
                private: false
            },
            {
                author: 'Eugenya Simonova',
                users: ['Boris Brodsky'],
                date: 1481877140552,
                message: 'Kazeol !!',
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
    const idx = messages.findIndex(msg => msg.date == date)
    messages.splice(idx,1)
}


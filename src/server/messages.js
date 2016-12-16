const users = require('./users')
const messages  = [
            {
                author: 'Boris Brodsky',
                users: ['Nastya','Max Lancaster'],
                date: Date.now(),
                message: 'Конечно, мы бы хотели получить от вас в ответ на это тестовое задание 100% реализацию требований, но это вовсе не обязательно, если вы понимаете, что охватить весь предложенный функционал в разумные сроки у вас не получится (в виду любых возможных обстоятельств), выберите комфортный для вас набор из списка требований — уверяем, это никаких не скажется на конечной оценке задания;',
                status: 'typing',
                private: true
            },
            {
                author: 'Boris Brodsky',
                users: [],
                date: Date.now(),
                message: 'Let\'s go out, guys',
                status: 'sending',
                private: false
            },
            {
                author: 'Eugenya Simonova',
                users: ['Boris Brodsky'],
                date: Date.now(),
                message: 'Kazeol !!',
                status: 'read',
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
const userList = []

exports.login = function (id, name) {
    if(userList.some(usr => usr.name == name)) return false
    userList.push({id, name})
    return true
}
exports.getNames = function() {
    return userList.map(x => x.name)
}

exports.getNamesBut = function(id) {
    const name = this.getName(id)
    return userList.map(x => x.name).filter(usr => usr != name)
}

exports.logout = function(id) {
    const idx = userList.findIndex(usr => usr.id == id)
    userList.splice(idx,1)
}

exports.getName = function(id) {
    var name = null
    userList.forEach(user => {
        if(user.id == id ){
            name = user.name
            return
        }
    })
    return name
}
exports.getId = function(name) {

    for(var i = 0; i < userList.length; i++)
        if( userList[i].name == name) return userList[i].id
    return null
}

exports.getAll = function() {
    return userList.map(usr => usr)
}
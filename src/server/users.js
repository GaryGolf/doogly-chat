const userList = []

exports.login =  function (id, name) {
    userList.push({id, name})
}

exports.logout = function(id) {
    userList = userList.filter(user => id != user.id)
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
let usersInSocket=[]

module.exports = {

    getUserBySocketId:(socketId)=>{
       return usersInSocket.find(function(user){
            if (user.socketId === socketId)
                return user
        })
    },
    userFound:(userId)=>{
        return usersInSocket.find(function(user){
            if (user.userId === userId)
                return true
        })
    },
    saveUser:(socket)=>{
        usersInSocket.push({
            userType:socket.handshake.query.userType,
            userId:socket.handshake.query.userId,
            status:'connected',
            socketId:socket.id,
        })
    },

    getAllUsers:()=>{
        return usersInSocket
    },
    updateUserStatus:(socketId,status)=>{
        usersInSocket=usersInSocket.map(function (user) {
            if (user.socketId === socketId)
                user.status=status
            return user
        })
    },

    updateUser:(data)=>{
        usersInSocket=usersInSocket.map(function (user) {
            if (user.userId === data.userId){
                user.lat=data.lat
                user.lng=data.lng
            }
            return user
        })
    }


}

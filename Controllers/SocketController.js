module.exports = function (io) {

    // connect --
    // disconnect
    // send to one user(private message)
    // send to tag
    // send to admin

    var socketRoom={}
    var socketUsers={}
    io.on('connection', function (socket) {

        socket.userType=socket.handshake.query.userType;
        socket.userId=socket.handshake.query.userId;
        socket.userName=socket.handshake.query.userName;

        console.log('socket console ' )
        socketUsers[socket.id]={
            userId:socket.userId,
            userName:socket.userName,
            userType:socket.userType,
            status:'connected',
            socketId:socket.id,
            locations:[]
            //push room
        }
        socket.on('create', (room) => {
            /*
            * check if there customers or admins to put in this room
            * */
            // add room to room list
            socketRoom[room]=room
            //join current session to room
            socket.join(room)

            // emit to subscribers that the room created
            io.sockets.in(room).emit('room-created', room);
            io.emit('refresh-socket');
        });
        socket.on('subscribe-to-room', (room) => {
            /*
            * show the admin list of rooms to subscribe which is not in it yet
            * make room tack objects of subscribers
            * check if not exist in room
            * */

            //join current session to room
            socket.join(socketRoom[room])

            io.sockets.in(room).emit('new-subscriber-joined', room); // edit the message
        });
        socket.on('subscribe-to-all-rooms', () => {
            console.log(socketUsers)

            //join current session to all rooms
            socket.join(Object.keys(socketRoom))
            // emit to subscribers that the room created
            io.sockets.in(Object.keys(socketRoom)).emit('new-subscriber-joined'); // edit the message
        });
        socket.on('send-data', (data) => {
            /*
            * if rooms or id's
            * */
            socketUsers[socket.id].locations.push(data.data)
            console.log(socketUsers[socket.id])
            io.sockets.in(data.to.rooms).emit('push-data', data.data); // This will emit the event to all connected sockets
        });
        // check if room exist return true with socket
        socket.on('list-rooms', () => {
            /*
            * get all rooms if admin exist
            * */

            socket.emit('get-all-rooms',socketRoom)

        })

        socket.on('get-clients-by-type',(type)=>{
            let data=Object.values(socketUsers)
            // console.log(data)
                data=data.filter(function (element) {
                if (element.userType === type)
                    return element
            })
            console.log('list-of-driver')
            socket.emit('list-of-'+type,data)

        })


        socket.on('disconnect', function (sockets) {

            userRepository.updateUserStatus(socket.id,'disconnected')
            io.emit('user-left', { user:userRepository.getUserBySocketId(socket.id)});

        });


    });
const userRepository=require('../Repositories/UserRepository')
}



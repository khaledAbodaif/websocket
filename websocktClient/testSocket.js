module.exports = function (io) {

      // connect --
      // disconnect
      // send to one user(private message)
      // send to tag
      // send to admin
  
      var socketRoom={}
      io.on('connection', function (socket) {
  
          // if (!userRepository.userFound(socket.handshake.query.userId))
          socket.userType=socket.handshake.query.userType;
          socket.userId=socket.handshake.query.userId;
          // if (socket.userType === 'admin')
          // console.log(socket)
              userRepository.saveUser(socket)
  
          socket.on('create', (room) => {
              /*
              * check if there customers or admins to put in this room
              * */
              // add room to room list
              socketRoom[room]=room
              //join current session to room
              socket.join(room)
              console.log(socketRoom)
              // userRepository.updateUser(data)
              // emit to subscribers that the room created
              io.sockets.in(room).emit('room-created', room); // This will emit the event to all connected sockets
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
              console.log('user subscribed')
              // userRepository.updateUser(data)
              // emit to subscribers that the room created
              io.sockets.in(room).emit('new-subscriber-joined', room); // edit the message
          });
          socket.on('subscribe-to-all-rooms', () => {
  
              //join current session to all rooms
              socket.join(Object.keys(socketRoom))
                          console.log('user subscribed')
              // emit to subscribers that the room created
              io.sockets.in(Object.keys(socketRoom)).emit('new-subscriber-joined'); // edit the message
          });
          socket.on('send-data', (data) => {
              /*
              * if rooms or id's
              * */
              console.log(data.to.rooms)
              // userRepository.updateUser(data)
              io.sockets.in(data.to.rooms).emit('push-data', data.data); // This will emit the event to all connected sockets
          });
          // check if room exist return true with socket
          socket.on('list-rooms', () => {
              /*
              * get all rooms if admin exist
              * */
              console.log(socketRoom)
  
              socket.emit('get-all-rooms',socketRoom)
  
          })
  
  
          socket.on('disconnect', function (sockets) {
  
              userRepository.updateUserStatus(socket.id,'disconnected')
              io.emit('user-left', { user:userRepository.getUserBySocketId(socket.id)});
  
          });
  
  
      });
  const userRepository=require('../Repositories/UserRepository')
  }
  
  
  
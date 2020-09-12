const socket=io("/")

socket.emit("join-room",ROOM_ID,10)

socket.on("user-connected",function(userid){
    console.log("user connected"+userid);
})
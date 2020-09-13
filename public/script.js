const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const mypeer = new Peer()
const Peers={};
const myvideo = document.createElement("video")
myvideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(function (stream) {
    addvideostream(myvideo, stream)

    mypeer.on("call",function(call){
        call.answer(stream)
        const video=document.createElement("video")
        call.on("stream",function(uservideostream){
            addvideostream(video,uservideostream)
        })
    })

    socket.on("user-connected", function (userid) {
        connectToNewUser(userid, stream)
    })

})

socket.on("user-disconnected",function(userid){
    if (Peers[userid]){
        Peers[userid].close()
    }
})
mypeer.on("open", function (id) {
    socket.emit("join-room", ROOM_ID, id)
})

function connectToNewUser(userid,stream)
{
    const call = mypeer.call(userid,stream)
    const video=document.createElement("video")
    call.on("stream",function(uservideostream){
        addvideostream(video,uservideostream)
    })
    call.on("close",function(){
        video.remove()
    })
    Peers[userid]=call
}

function addvideostream(video, stream) {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", function () {
        video.play()

    })
    videoGrid.append(video);
}
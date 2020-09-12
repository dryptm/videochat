const express=require("express");
const app=express();
const server=require("http").Server(app);
const io=require("socket.io")(server);
const {v4:uuidv4}=require("uuid");


app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",function(req,res){
    res.redirect(`/${uuidv4()}`);

})
app.get("/:room",function(req,res){
    res.render('room',{ roomID:req.params.room })
})
io.on("connection",function(socket){
    socket.on("join-room",function(roomID,userid){
       socket.join(roomID);
       socket.to(roomID).broadcast.emit("user-connected",userid);

    })
})

server.listen(3000);

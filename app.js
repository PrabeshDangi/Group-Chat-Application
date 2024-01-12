const express=require("express")
const path=require("path")
const app=express()
const port=process.env.port||5001;

const server=app.listen(port,()=>{
    console.log(`Server started on port ${port}!!`)
})

const io=require("socket.io")(server);

app.use(express.static(path.join(__dirname,'public')))

let socketsConnected=new Set()

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        console.log("socket disconnected",socket.id);
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat',data)
    })
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    })
}
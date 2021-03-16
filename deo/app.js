const express=require('express');
const socketio=require('socket.io');
const http=require('http');

const cors=require('cors');

var PORT=(process.env.PORT || 5000);

const app=express();
const server=http.createServer(app);
const io=socketio(server);

const router=require('./router');



const {addUser,removeUser,getUser,getUserInRooms}=require('./user');

app.use(router);
app.use(cors);

io.on('connection',(socket)=>{

    socket.on('join',({name,room},callback)=>{
        const {error,user}=addUser({id:socket.id,name,room});
        
        if(error)
            return callback({error})
        socket.join(user.room);
        socket.emit('message',{user:'admin',text:`${user.name},Welcome to room ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined`});
        io.to(user.room).emit('roomData',{room:user.room,users:getUserInRooms(user.room)});
        

        callback();
    });

    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id);

        io.to(user.room).emit('message',{user:user.name,text:message});
        
        callback();
    });


    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`{user.name} has left.`});
            io.to(user.room).emit('roomData',{room:user.room,users:getUserInRooms(user.room)});
        }
    });
})


server.listen(PORT,()=>{
    console.log('server is running');
})
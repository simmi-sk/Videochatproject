const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require('socket.io')(server);

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
debug: true,
});
app.use('/peerjs', peerServer);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
});

io.on('connection', socket=> {
    socket.on('join-room',(roomId,userId)=>{
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    socket.on('disconnect', () => {
    socket.to(roomId).emit('user-disconnected', userId)
    })
    })
   
})
const port = process.env.PORT || 3030;
server.listen(port, () => console.log(`server is running on port ${port}`));
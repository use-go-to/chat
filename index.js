const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.use('/', express.static('public'));

const users = [];

io.on('connection', (socket) => {
    console.log('user is connected with id:', socket.id);

    socket.on('nickname', ({ nickname }) => {
        console.log(nickname , 'is added');
        users.push({
            id: socket.id,
            nickname
        });







        





    });

    socket.on('message', ({ nickname, message }) => {

        console.log(nickname ,':', message);

        
        

        const ts = (new Date()).getTime();
        socket.broadcast.emit('message', { nickname, message, ts });

       
        const fs = require('fs');

        const data = nickname + ":" + message;
        
        fs.appendFile('log.txt', data + "\n", (err) => {
          if (err) throw err;
          console.log('The data has been added to the file!');
        });
        


    });

    socket.on('disconnect', () => {
        console.log('user is disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});


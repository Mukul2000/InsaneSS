import { io } from "socket.io-client";

async function connect(url) {
    return new Promise((resolve, reject) => {
        const socket = io(url);

        if(!socket) reject();

        socket.on('connect', () => {
            resolve(socket);
        })

        socket.on('connect_error', (err) => {
            console.log("Connection error : ", err);
            reject(err);
        })
    })
}

async function joinGameRoom(socket, roomId) {
    return new Promise((resolve, reject) => {
        socket.emit('join_game', {roomId});
        socket.on('room_joined', () => resolve(true));
        socket.on('room_join_error', ({error}) => reject(error));
    }
    );
}

async function updateGame(socket, board) {
    socket.emit('update_game', {board: board});
} 

export {joinGameRoom, connect, updateGame};
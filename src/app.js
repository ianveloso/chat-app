const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const {generateMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json)

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})
        
        if(error) {
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit('message', generateMessage(`Welcome ${user.username}!`, 'SlackBot'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`, 'SlackBot'))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        let user = getUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage(message, user.username))
            callback()
        }
    })

    socket.on('sendLocation', (coords, callback) => {
        let user = getUser(socket.id)

        if(user) {
            io.to(user.room).emit('locationMessage', generateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username))
            callback()
        }
    })

    socket.on('disconnect', () => {
        let user= removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left`, 'SlackBot'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

module.exports = server
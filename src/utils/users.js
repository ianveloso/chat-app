const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users[index]
    }
}

const getUsersInRoom = (room) => {
    let roomParsed = room.trim().toLowerCase()
    
    let res = users.filter((user) => {
        return user.room === roomParsed
    })

    return res
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

const users = [];

export const userJoin = (id, username, room) => {
const user = {id, username, room}
users.push(user);

return user;
}

// Get current user 
export const getCurrentUser = (id) => {
return users.find(User => User.id === id)
}

// User leaves chat
export const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
    return users.splice(index, 1)[0];
    }
    }


// Get room users 
export const getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}    


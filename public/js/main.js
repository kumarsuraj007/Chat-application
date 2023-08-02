const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);

// Join room
socket.emit("joinRoom", { username, room });

// Get users and room
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUserName(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessages(message);

  // Scroll messages
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const outputMessages = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
<p class="text"> 
    ${message.text}
</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUserName(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join('')}`;
}

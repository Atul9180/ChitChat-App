const socket = io("http://localhost:8000", { transports: ["polling"] });

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInput");
const messageHolder = document.querySelector(".container");

//Audio on msg receive
//const audio= new Audio('./alert.mp3');

//create and append user message based onleft right position
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageHolder.append(messageElement);
  // if(position =='left'){  audio.play(); }
};

//take name from user and let server know
const u_name = prompt("Enter your name to join chat: ");
socket.emit("new_user_joined", u_name); //tagging event newuser-joined with name to send name and broadcast to everyone

//listen the emitted event 'new_user_joined' and receive his name from server
socket.on("user_joined", (u_name) => {
  append(`${u_name} joined the chat.`, "center");
});

// server sends a message, receive it
socket.on("msg_receive", (data) => {
  append(`${data.u_name}: ${data.message}`, "left");
});

// If a user leaves the chat, append the info to the container
socket.on("user_left", (u_name) => {
  append(`${u_name} left the chat`, "center");
});

// on msg submit, send  message to server
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("msg_send", message);
  messageInput.value = "";
});

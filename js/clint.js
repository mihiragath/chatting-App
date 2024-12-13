const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Sound for receiving messages
const audio = new Audio("ting.mp3");

// Function to append messages to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);

  // Play sound only for incoming messages
  if (position === "left") {
    audio.play();
  }
};

// Form submission: Send a message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value; // Corrected property
  append(`You: ${message}`, "right");
  socket.emit("send", message); // Send message to server
  messageInput.value = ""; // Clear the input field
});

// Prompt user for their name
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

// Listen for events from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});

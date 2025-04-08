const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Initialize the client with LocalAuth
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  // Example usage: send OTP to an Egyptian phone number
  sendOtp("201063598516"); // Replace with the actual phone number
});

// Function to send a 6-digit OTP to an Egyptian phone number
function sendOtp(phoneNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  const message = `Your OTP is: ${otp}`;

  // Send the message
  client
    .sendMessage(`${phoneNumber}@c.us`, message)
    .then((response) => {
      if (response.id.fromMe) {
        console.log("OTP sent successfully!");
      }
    })
    .catch((err) => {
      console.error("Failed to send OTP:", err);
    });
}

client.on("message", (msg) => {
  console.log(`Received message: ${msg.body}`); // Log the received message

  if (msg.body.trim() === "!ping") {
    // Use trim to remove any accidental spaces
    msg
      .reply("pong")
      .then(() => {
        console.log("Replied with pong");
      })
      .catch((err) => {
        console.error("Failed to send reply:", err);
      });
  }
});

// Handle session termination and other errors
client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
  // You can attempt to reinitialize the client or notify the user
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failure:", msg);
  // Handle authentication failure, possibly by re-authenticating
});

client.initialize();

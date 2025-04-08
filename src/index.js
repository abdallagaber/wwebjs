const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Create WhatsApp client instance with session persistence
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "whatsapp-otp-bot",
    dataPath: "./.wwebjs_auth",
  }),
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920x1080",
      '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"',
    ],
  },
  authTimeoutMs: 60000,
  qrTimeoutMs: 40000,
  restartOnAuthFail: true,
});

// Handle errors
client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
});

// Handle disconnects
client.on("disconnected", (reason) => {
  console.log("Client was disconnected:", reason);
});

// Generate QR Code for authentication (only needed for first time)
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Please scan the QR code with your WhatsApp app");
});

// When client is ready
client.on("ready", () => {
  console.log("Client is ready!");
  // After client is ready, you can send OTP
  sendOTP("201208310237"); // Replace with the target phone number
});

// Function to format phone number to WhatsApp ID
function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  // Add @c.us suffix
  return `${cleaned}@c.us`;
}

// Function to generate and send OTP
async function sendOTP(phoneNumber) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const message = `Your OTP code is: ${otp}`;
    const chatId = formatPhoneNumber(phoneNumber);

    console.log(`Attempting to send OTP to ${chatId}...`);
    await client.sendMessage(chatId, message);
    console.log(`OTP sent successfully to ${phoneNumber}: ${otp}`);
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    if (error.message.includes("invalid number")) {
      console.error(
        "Please make sure the phone number is correct and includes the country code"
      );
    }
  }
}

// Initialize the client
console.log("Initializing WhatsApp client...");
console.log(
  "Make sure you have a stable internet connection and Chrome is installed."
);
client.initialize();

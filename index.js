require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ABOUT_URL = process.env.ABOUT_URL;
const IMAGE_PATH = process.env.IMAGE_PATH;
const BASE_URL = process.env.BASE_URL;
const APP_URL = process.env.APP_URL;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const messageText = `*WELCOME TO GREENS* 🌳
We are working on arena mode where you can fight each other and defend the farm. Now you can play our telegram version of the game to\n
• plant crops,
• earn greens token,
• collect silver coins and,
• win cards.`;

// Listen for the '/start' command
bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;

  let params = match[1].trim();

  if (!params) {
    params = APP_URL; // Fallback URL if params is not a valid URL
  } else {
    params = `${APP_URL}?startapp=${params}`;
  }

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "About", url: ABOUT_URL },
          { text: "Play", url: params },
        ],
      ],
    },
  };

  // Send the photo with the message and inline keyboard
  bot
    .sendPhoto(chatId, IMAGE_PATH, {
      caption: messageText,
      parse_mode: "Markdown",
      ...options,
    })
    .then(() => {
      console.log(`Message sent: ${params}`);
    })
    .catch((err) => {
      console.error("Error sending message:", err);
    });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const partnerToken = text.substring(8); // Extract everything after "partner-"

  if (text.startsWith("partner-")) {
    bot.sendMessage(chatId, `Wait...`);
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/partners/token/${partnerToken}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response}`);
        }
        const data = await response.json();
        bot.sendMessage(chatId, JSON.stringify(data));
      } catch (error) {
        bot.sendMessage(chatId, `Error: try again`);
        console.error("Fetch error:", error.message);
      }
    };

    fetchStatistics();
  }
});

console.log("Bot is running...");

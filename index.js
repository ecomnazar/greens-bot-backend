require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;
// const ABOUT_URL = process.env.ABOUT_URL;
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

// params: url from partners
function showButtons(messageType, chatId, userLanguage, text, params) {
  if (messageType === "private") {
    let buttons;
    const chooseOption =
      userLanguage === "ru" ? "Выберите опцию:" : "Choose option:";

    if (userLanguage === "ru") {
      buttons = [
        [{ text: "Играть" }],
        [{ text: "Вебсайт" }],
        [{ text: "Канал" }],
        [{ text: "Поддержка" }],
      ];
    } else {
      buttons = [
        [{ text: "Play" }],
        [{ text: "Website" }],
        [{ text: "Channel" }],
        [{ text: "Support" }],
      ];
    }

    if (text.startsWith("partner-")) return;

    bot.sendMessage(chatId, chooseOption, {
      reply_markup: {
        keyboard: buttons,
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });

    if (text === "Играть" || text === "Play") {
      bot.sendMessage(chatId, "Open Greens", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Open",
                url: params ? params : "http://t.me/GreensfiBot/play",
              },
            ],
          ],
        },
      });
    } else if (text === "Вебсайт" || text === "Website") {
      bot.sendMessage(chatId, "Open Greens website", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Visit Website", url: "https://www.greensfi.com" }],
          ],
        },
      });
    } else if (text === "Канал" || text === "Channel") {
      bot.sendMessage(chatId, "Join to Greens Telegram channel", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Join Channel", url: "https://t.me/greensfi" }],
          ],
        },
      });
    } else if (text === "Поддержка" || text === "Support") {
      bot.sendMessage(chatId, "Join to Greens Support Telegram group", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Get Support", url: "https://t.me/+UEWpodrytbxiYTJi" }],
          ],
        },
      });
    }
  }
}

// Listen for the '/start' command
bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  let params = match[1].trim();

  if (!params) {
    params = APP_URL; // Fallback URL if params is not a valid URL
  } else {
    params = `${APP_URL}?startapp=${params}`;
  }

  const options = {
    reply_markup: {
      inline_keyboard: [
        // [
        //   { text: "About", url: ABOUT_URL },
        // ],
        [{ text: "Play", url: params }],
      ],
    },
  };

  bot
    .sendPhoto(chatId, IMAGE_PATH, {
      caption: messageText,
      parse_mode: "Markdown",
      ...options,
    })
    .then((sentMessage) => {
      console.log(`Message sent: ${params}`);
      // Pin the message
      bot
        .pinChatMessage(chatId, sentMessage.message_id)
        .then(() => {
          console.log("Message pinned successfully");
        })
        .catch((err) => {
          console.error("Error pinning message:", err);
        });
    });

  showButtons(msg.chat.type, chatId, msg.from.language_code, text, params);
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
    return;
  }

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  if (text.startsWith("/start")) return;
  showButtons(msg.chat.type, chatId, msg.from.language_code, text);

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
});

console.log("Bot is running...");

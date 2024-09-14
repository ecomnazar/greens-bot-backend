require("dotenv").config();

const sendPartnerStatistics = require("./sendPartnerStatistics");
const sendIntroductionContent = require("./sendIntroductionContent");

const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot
  .setMyCommands([])
  .then(() => {
    return bot.setMyCommands([
      { command: "play", description: "Start game" },
      { command: "website", description: "Visit website" },
      { command: "channel", description: "Join channel" },
      { command: "support", description: "Join support group" },
      { command: "instructions", description: "Read the instructions" },
    ]);
  })
  .then(() => {
    console.log("Commands were reset and set successfully.");
  })
  .catch((error) => {
    console.error("Error setting commands:", error);
  });

// Listen for the '/start' command
bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  let params = match[1].trim();

  bot
    .setMyCommands([]) // Очищаем все текущие команды
    .then(() => {
      // Устанавливаем новые команды
      return bot.setMyCommands([
        { command: "start", description: "Start the bot1" },
        { command: "help", description: "Get help using the bot" },
        { command: "settings", description: "Adjust your settings" },
      ]);
    })
    .then(() => {
      console.log("Commands were reset and set successfully.");
    })
    .catch((error) => {
      console.error("Error setting commands:", error);
    });

  sendIntroductionContent(bot, params, chatId);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // if text starts with "partner-", send partner statistics
  sendPartnerStatistics(bot, text, chatId);

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  const returnOptions = (title, url) => ({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: title,
            url: url,
          },
        ],
      ],
    },
  });

  if (text.startsWith("/play")) {
    sendIntroductionContent(bot, null, chatId);
  }
  if (text.startsWith("/website")) {
    bot.sendMessage(
      chatId,
      "Visit our website to know more about team, token and roadmap.",
      returnOptions("Open", "https://www.greensfi.com")
    );
  }
  if (text.startsWith("/channel")) {
    bot.sendMessage(
      chatId,
      "Visit our telegram channel to follow the news.",
      returnOptions("Open", "https://t.me/greensfi")
    );
  }
  if (text.startsWith("/support")) {
    bot.sendMessage(
      chatId,
      "Visit our telegram support chat to ask questions.",
      returnOptions("Open", "https://t.me/+UEWpodrytbxiYTJi")
    );
  }
});

console.log("Bot is running...");

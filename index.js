require("dotenv").config();
const axios = require("axios");

const sendPartnerStatistics = require("./sendPartnerStatistics");
const sendIntroductionContent = require("./sendIntroductionContent");

const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Listen for the '/start' command
bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  let params = match[1].trim();

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

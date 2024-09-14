const APP_URL = process.env.APP_URL;
const IMAGE_PATH = process.env.IMAGE_PATH;

const messageText = `*WELCOME TO GREENS* 🌳
We are working on arena mode where you can fight each other and defend the farm. Now you can play our telegram version of the game to\n
• plant crops,
• earn greens token,
• collect silver coins and,
• win cards.`;

function sendIntroductionContent(bot, params, chatId) {
  if (!params) {
    params = APP_URL;
  } else {
    params = `${APP_URL}?startapp=${params}`;
  }

  const options = {
    reply_markup: {
      inline_keyboard: [[{ text: "Play", url: params }]],
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
}

module.exports = sendIntroductionContent;

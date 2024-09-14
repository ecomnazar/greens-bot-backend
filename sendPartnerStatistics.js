const BASE_URL = process.env.BASE_URL;

function sendPartnerStatistics(bot, text, chatId) {
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
}

module.exports = sendPartnerStatistics;

const TelegramBot = require('node-telegram-bot-api');

const token = '1204445809:AAE0OM12bXnrrR9SLy6jTwPMU7AW3yVQZAI';
const bot = new TelegramBot(token, {
  polling: true
});



bot.onText(/\/hentai/, function onLoveText(msg) {
  bot.sendMessage(msg.chat.id, 'Are you a hetai?');
});


bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

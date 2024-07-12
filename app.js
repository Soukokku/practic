const TelegramBot = require('node-telegram-bot-api');

const botToken = '7061379303:AAE-Ai8wxy8zuC-UNdOiguPaxiu1NlOkfq4'; 
const bot = new TelegramBot(botToken, { polling: true });


bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const textToEcho = match[1];
    bot.sendMessage(chatId, textToEcho);
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, Октагон!');
});

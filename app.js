const TelegramBot = require('node-telegram-bot-api');
const token = '7061379303:AAE-Ai8wxy8zuC-UNdOiguPaxiu1NlOkfq4';
const bot = new TelegramBot(token, {polling: true});

const keyboard = [
    [{ text: '/help' }],
    [{ text: '/site' }],
    [{ text: '/creator' }]
];

const options = {
    reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true
    }
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const startMessage = 'Здравствуйте, выберите команду из меню';
    bot.sendMessage(chatId, startMessage, options);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
Список команд:
- /help - возвращает список команд с их описанием
- /site - отправляет в чат ссылку на сайт Октагона
- /creator - отправляет в чат ФИО создателя`;
    bot.sendMessage(chatId, helpMessage, options);
});

bot.onText(/\/site/, (msg) => {
    const chatId = msg.chat.id;
    const siteMessage = 'https://students.forus.ru/';
    bot.sendMessage(chatId, siteMessage, options);
});

bot.onText(/\/creator/, (msg) => {
    const chatId = msg.chat.id;
    const FIOMessage = 'Юсупова Юлия Альфридовна';
    bot.sendMessage(chatId, FIOMessage, options);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.startsWith('/')) {
        return;
    }
    bot.sendMessage(chatId, 'Привет, Октагон!', options);
});
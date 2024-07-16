const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');
const token = '7061379303:AAE-Ai8wxy8zuC-UNdOiguPaxiu1NlOkfq4';
const bot = new TelegramBot(token, { polling: true });

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "chatbottests",
    password: "",
    charset: "UTF8_GENERAL_CI"
});

connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения', err);
        return;
    }
    console.log('Соединение установлено.');
});

const keyboard = [
    [{ text: '/help' }],
    [{ text: '/site' }],
    [{ text: '/creator' }],
    [{ text: '/randomItem' }],
    [{ text: '/deleteItem' }],
    [{ text: '/getItemByID' }]
];

const options = {
    reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true
    }
};

let Cache = {};

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
- /creator - ФИО автора
- /randomItem - возвращает случайный предмет из БД
- /deleteItem - удаляет предмет из БД по ID
- /getItemByID - возвращает предмет из БД по ID
    `;
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

bot.onText(/\/randomItem/, (msg) => {
    
    const chatId = msg.chat.id;
    
    connection.query('SELECT * FROM test ORDER BY RAND() LIMIT 1', (error, results) => {
        
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            bot.sendMessage(chatId, 'Ошибка получения случайного предмета', options);
            return;
        }

        if (results.length > 0) {
            const item = results[0];
            console.log('Случайный предмет', item);
            bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`, options);

        } else {
            bot.sendMessage(chatId, 'Отсутсвие предметов в БД', options);
        }

    });
});


bot.onText(/\/deleteItem/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Введите ID предмета, который должен быть удален', options);
    Cache[chatId] = '/deleteItem';
});


bot.onText(/\/getItemByID/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Введите ID предмета, который должен быть получен', options);
    Cache[chatId] = '/getItemByID';
});


bot.on('message', (msg) => {
    
    const chatId = msg.chat.id;
    const text = msg.text;

    if (/^\d+$/.test(text)) {
        const itemId = parseInt(text, 10);

        if (Cache[chatId] === '/getItemByID') {
            connection.query('SELECT * FROM test WHERE ID = ?', [itemId], (error, results) => {
                if (error) {
                    console.error('Ошибка выполнения запроса', error);
                    bot.sendMessage(chatId, 'Ошибка получения предмета', options);
                    return;
                }

                if (results.length > 0) {
                    const item = results[0];
                    console.log('Полученный предмет:', item);
                    bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`, options);
                } else {
                    bot.sendMessage(chatId, 'Отсутствует предмет с таким ID', options);
                }
            });
        }

        

        if (Cache[chatId] === '/deleteItem') {
            connection.query('DELETE FROM test WHERE ID = ?', [itemId], (error, results) => {
                if (error) {
                    console.error('Ошибка выполнения запроса:', error);
                    bot.sendMessage(chatId, 'Ошибка при удалении', options);
                    return;
                }

                if (results.affectedRows > 0) {
                    bot.sendMessage(chatId, 'Удачно', options);
                } else {
                    bot.sendMessage(chatId, 'Ошибка', options);
                }
            });
        }

       
        delete Cache[chatId];
    } else if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, 'Введите команду или корректный ID', options);
    }
});
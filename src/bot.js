/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import { getLang } from './user.js'


/**
 * Handle requests to /endpoint
 * https://core.telegram.org/bots/api#update
 */
export async function update(event) {
    // Check secret
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== BOT_API_SECRET) {
        //return new Response('Unauthorized', { status: 403 });
    }

    // Read request
    const update = await event.request.json();
    // Deal with the response asynchronously
    event.waitUntil(handleUpdate(update));

    return new Response("Ok");
}


/**
 * Handle event update
 */
async function handleUpdate(update) {
    if ('message' in update) {
        const lang = await getLang(update.message.from.id);
        handleMessage(update.message, lang);
    } 

    if ('callback_query' in update) {
        const lang = await getLang(update.callback_query.from.id);
        handleMessage(update.message, lang);
    }
}


/**
 * Handle incoming message
 */
async function handleMessage(message, lang) {
    const botReplies = new Map([
        ["welcome", new Map([
            ["ua", 
                `🥳 📚 *Вітаю, ${message.from.first_name}!*\n\n` +
                "Твоя відданість та працьовитість принесуть плоди. Прийми найщиріші побажання успіху та досягнень!\n\n" +
                "🇺🇦 Ти - майбутнє нашої країни. Розкрий свій потенціал, набувай знання та відкривай нові горизонти!\n\n" +
                "__Ми віримо в тебе! Завтрашній день належить тобі. Успіхів у підготовці до іспитів!__ 😇\n"
            ],
            ["en",
                `🥳 📚 *Welcome, ${message.from.first_name}!*\n\n` +
                "Your dedication and hard work will pay off. Accept the most sincere wishes for success and achievements!\n\n" +
                "🇺🇦 You're the future. Unleash your potential, gain knowledge and open new horizons!\n\n" +
                "__You're our hope! Tomorrow is yours. Good luck with the exams! 😇\n"
            ]])],

        ["help", new Map([
            ["ua",
                "👋 *Привіт*,\n\n" +
                "🤝 Я - твій вірний супутник у світі історії. Моє завдання - надавати тобі швидкі й точні відповіді на запити!\n\n" +
                "💬 Щоб розпочати, відправляй назву події, рік або ім'я діяча та отримуй цікаві факти, інформацію і документи.\n\n" +
                "Тисни в моєму меню:\n" +
                "`/help` - відправлю це повідомлення знову\n" +
                "`/language` - змінюй мову // change the language\n" +
                "`/random` - випадкова цікавинка\n\n" +
                "✨ *Хай щастить!*\n"
            ],
            ["en",
                "👋 *Hi*,\n\n" +
                "🤝 I'm your faithful assistant in the world of history. My task is to provide you with quick and accurate answers to your queries!\n\n" +
                "💬 To get started, send an event title, year or name of the historical figure and I'll get you flooded with interesting facts, information and documents.\n\n" +
                "Press in my menu:\n" +
                "`/help` - resend this message\n" +
                "`/language` - change the language\n" +
                "`/random` - a random history fact\n\n" +
                "✨ Good luck!\n"
            ],
        ])],

        ["language", new Map([
            ["ua", "⚡ Бот-Архіваріус пропонує тобі обрати мову з доступних нижче:\n"],
            ["en", "⚡ Bot-Archivarius offers you to choose a preferred language from the available ones below:\n"],
        ])],
    ]);
    
    sendMessage(message.chat.id, lang);

    if (message.text.startsWith('/start')) {
        const welcome_msg = botReplies.get("welcome").get(lang);
        return sendMessage(message.chat.id, welcome_msg);

    } else if (message.text.startsWith('/help')) {
        const help_msg = botReplies.get("help").get(lang);
        return sendMessage(message.chat.id, help_msg);

    } else if (message.text.startsWith('/language')) {
        const help_msg = botReplies.get("language").get(lang);
        return sendMessage(message.chat.id, help_msg);
    }
}


/**
 * Send a new message
 */
function sendMessage(chatId, text) {
    return callApi(BOT_API_TOKEN, 'sendMessage', { chat_id: chatId, text: text, parse_mode: 'Markdown' });
}


/**
 * Fetch resources to telegram bot API
 */
export async function callApi(bot_api_token, methodName, params = null) {
    let query = '';
    if (params) {
        query = '?' + new URLSearchParams(params).toString();
    }

    const apiUrl = `https://api.telegram.org/bot${bot_api_token}/${methodName}${query}`;
    const r = await (await fetch(apiUrl)).json();

    return new Response(JSON.stringify(r));
}

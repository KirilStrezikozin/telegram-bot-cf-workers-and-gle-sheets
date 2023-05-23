/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import { getLang, setLang } from './user.js'
import * as api from './api.js'
import * as botReply from './reply.js'


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
        handleCallback_query(update.callback_query, lang);
    }
}


/**
 * Handle incoming message
 */
async function handleMessage(message, lang) { 
    api.sendMessage(message.chat.id, lang);

    if (message.text.startsWith('/start')) {
        const welcome_msg = botReply.get("welcome", lang, message.from.id);
        return api.sendMessage(message.chat.id, welcome_msg);

    } else if (message.text.startsWith('/help')) {
        const help_msg = botReply.get("help", lang, message.from.id);
        return api.sendMessage(message.chat.id, help_msg);

    } else if (message.text.startsWith('/language')) {
        const lang_msg = botReply.get("language", lang, message.from.id);

        return api.sendMessage(message.chat.id, lang_msg, buttons = [
            { text: "🇺🇦 Українська", callback_data: 'set_lang_ua' },
            { text: "🇺🇸 English", callback_data: 'set_lang_en' }]);
    }
}


/**
 * Handle incoming callback_query (inline button press)
 * https://core.telegram.org/bots/api#message
 */
async function handleCallback_query(callback_query, lang) {
    if (callback_query.data === 'set_lang_ua') {
        await setLang(callback_query.from.id, "ua");

        const lang_set_msg = botReply.get("language_set", lang, callback_query.from.id)
        return api.answerCallbackQuery(callback_query.id, lang_set_msg);

    } else if (callback_query.data === 'set_lang_en') {
        await setLang(callback_query.from.id, "en");

        const lang_set_msg = botReply.get("language_set", lang, callback_query.from.id)
        return api.answerCallbackQuery(callback_query.id, lang_set_msg);

    } else {
        const invalid_msg = botReply.get("invalid", lang, callback_query.from.id);
        return api.sendMessage(callback_query.message.chat.id, invalid_msg);
    }
}

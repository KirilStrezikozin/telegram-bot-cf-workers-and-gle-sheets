/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import * as api from './api.js'
import { getReply } from './reply.js'


/**
 * Handle requests to /endpoint
 * https://core.telegram.org/bots/api#update
 */
export async function update(event) {
    // Check secret
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== BOT_API_SECRET) {
        return new Response('Unauthorized', { status: 403 });
    }

    if (event.request.method === 'POST') {

        // Read request
        const update = await event.request.json();
        // Deal with the response asynchronously
        event.waitUntil(handleUpdate(update));
    }

    return new Response("Ok");
}


/**
 * Handle event update
 */
async function handleUpdate(update) {
    if ('message' in update) {
        const lang = "ua";
        // const userLang = 'LANG_' + update.message.from.id;

        // // Get user's preferred language
        // let lang = await kv_bot_prefs.get(userLang);

        // // If not found, put a new LANG entry for the user
        // if (lang === null) {
        //     await kv_bot_prefs.put(userLang, "ua");
        //     lang = "ua";
        // }

        handleMessage(update.message, lang);
    } 

    if ('callback_query' in update) {
        const lang = "ua";
        // const userLang = 'LANG_' + update.message.from.id;

        // // Get user's preferred language
        // let lang = await kv_bot_prefs.get(userLang);

        // // If not found, put a new LANG entry for the user
        // if (lang === null) {
        //     await kv_bot_prefs.put(userLang, "ua");
        //     lang = "ua";
        // }

        handleCallback_query(update.callback_query, lang);
    }
}


/**
 * Handle incoming message
 */
async function handleMessage(message, lang) { 
    if (message.text.startsWith('/start')) {
        const welcome_msg = getReply("welcome", lang, message.from.first_name);
        const help_msg = getReply("help", lang);

        const r1 = await api.sendMessage(message.chat.id, welcome_msg).then(
            async () => { await api.sendMessage(message.chat.id, help_msg); }
        );
        return r1;

        const r2 = await api.sendMessage(message.chat.id, help_msg);
        return r2;

    } else if (message.text.startsWith('/help')) {
        const help_msg = getReply("help", lang);
        return api.sendMessage(message.chat.id, help_msg);

    } else if (message.text.startsWith('/language')) {
        const lang_msg = getReply("language", lang);

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
        // await kv_bot_prefs.put(`LANG_${userId}`, value);

        await api.sendMessage(callback_query.message.chat.id, "🇺🇦");

        const lang_set_msg = getReply("language_set", lang)
        return api.answerCallbackQuery(callback_query.id, lang_set_msg);

    } else if (callback_query.data === 'set_lang_en') {
        // await kv_bot_prefs.put(`LANG_${userId}`, value);

        await api.sendMessage(callback_query.message.chat.id, "🇺🇸");

        const lang_set_msg = getReply("language_set", lang)
        return api.answerCallbackQuery(callback_query.id, lang_set_msg);

    } else {
        const invalid_msg = getReply("invalid", lang);
        return api.sendMessage(callback_query.message.chat.id, invalid_msg);
    }
}

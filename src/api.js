/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */


/**
 * Send a new message
 */
export function sendMessage(chatId, text, buttons = null) {
    if (buttons) {
        return callApi(BOT_API_TOKEN, 'sendMessage', { chat_id: chatId, text: text, parse_mode: 'Markdown',
            reply_markup: JSNO.stringify({ inline_keyboard: buttons }) });
    } else {
        return callApi(BOT_API_TOKEN, 'sendMessage', { chat_id: chatId, text: text, parse_mode: 'Markdown' });
    }
}


/**
 * Answer a callback query
 */
export function answerCallbackQuery(callbackQueryId, text) {
    return callApi(BOT_API_TOKEN, 'answerCallbackQuery', { callback_query_id: callbackQueryId, text: text });
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

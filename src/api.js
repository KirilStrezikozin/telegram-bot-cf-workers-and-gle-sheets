/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */


/**
 * Send a new message
 */
export function sendMessage(chatId, msgText, buttons = null) {
    if (buttons) {
        return callApi(BOT_API_TOKEN, 'sendMessage', { chat_id: chatId, text: msgText, parse_mode: 'Markdown',
            reply_markup: JSON.stringify({ inline_keyboard: buttons }) });
    } else {
        return callApi(BOT_API_TOKEN, 'sendMessage', { chat_id: chatId, text: msgText, parse_mode: 'Markdown' });
    }
}


/**
 * Answer a callback query
 */
export function answerCallbackQuery(callbackQueryId, msgText) {
    return callApi(BOT_API_TOKEN, 'answerCallbackQuery', { callback_query_id: callbackQueryId, text: msgText });
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

    try {
        const data = await fetch(apiUrl);
        const result = await data.json();

        // return new Response(JSON.stringify(r));
        return new Response('ok' in result && result.ok ? 'Ok' : JSON.stringify(result, null, 2));

    } catch (error) {
        return new Response("Error while calling bot API", { status: 403 });
    }
}

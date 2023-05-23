/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */


/**
 * Handle requests to /endpoint
 * https://core.telegram.org/bots/api#update
 */
export async function update(event) {
    // Check secret
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== BOT_API_SECRET) {
        return new Response('Unauthorized', { status: 403 });
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
        handleMessage(update.message);
    }
}


/**
 * Handle incoming message
 */
function handleMessage(message) {
    if (message.text.startsWith('/start')) {
        return sendMessage(message.chat.id, 'Hello');
    }
}


/**
 * Send a new message
 */
function sendMessage(chatId, text) {
    return callApi(BOT_API_TOKEN, 'sendMessage', { chat_id: chatId, text: text });
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

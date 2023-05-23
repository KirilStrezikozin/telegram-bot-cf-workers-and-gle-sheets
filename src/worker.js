/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import * as webhook from './webhook.js'
import * as bot from './bot.js'


/**
 * Wait for requests to the Worker.
 */
addEventListener('fetch', event => {
    event.respondWith(handleEvent(event));
});


/**
 * Handle events sent to the Worker.
 */
async function handleEvent(event) {
    const urlData = new URL(event.request.url);

    // Handle bot's webhook
    if (urlData.pathname === '/setWebhook') { return webhook.set(urlData); }
    else if (urlData.pathname === '/deleteWebhook') { return webhook.unset(urlData); }
    else if (urlData.pathname === '/getWebhookInfo') { return webhook.getInfo(urlData); }

    else if (urlData.pathname === '/endpoint') { return bot.update(event); }

    else { return new Response("Invalid URL pathname."); }
}

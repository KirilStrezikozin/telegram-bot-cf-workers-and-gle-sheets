/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import { Handler } from "./handler";


const handler = new Handler(BOT_API_TOKEN, BOT_API_SECRET);


/**
 * Handler responds to requests to the Worker.
 */
addEventListener('fetch', event => {
    event.respondWith(handler.handle(event.request));
});

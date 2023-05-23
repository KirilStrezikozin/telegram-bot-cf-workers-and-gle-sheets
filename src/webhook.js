/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import { callApi } from './bot.js'


export function set(urlData) {
    const webhookUrl = `${urlData.protocol}//${urlData.hostname}/endpoint`;
    console.log(webhookUrl)
    return handleWebhook(urlData, 'setWebhook', { url: webhookUrl, secret_token: BOT_API_SECRET });
}


export function unset(urlData) {
    return handleWebhook(urlData, 'deleteWebhook', { drop_pending_updates: true });
}


export function getInfo(urlData) {
    const webhookUrl = `${urlData.protocol}//${urlData.hostname}/endpoint`;
    return handleWebhook(urlData, 'getWebhookInfo', { url: webhookUrl });
}


async function handleWebhook(urlData, methodName, params = null) {
    const bot_api_token = urlData.searchParams.get('bot');

    if (bot_api_token === null) { 
        return new Response("No bot API token provided.");
    } else if (bot_api_token != BOT_API_TOKEN) { 
        return new Response("Provided bot API token and expected one didn't match.");
    }

    return callApi(bot_api_token, methodName, params);
}

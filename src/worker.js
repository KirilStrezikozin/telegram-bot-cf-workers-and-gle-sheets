/**
 * Visit README.md in the project root for usage guide.
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */


/*
 * Wait for requests to the Worker.
 */
addEventListener('fetch', event => {
    event.respondWith(handleEvent(event));
});


/*
 * Handle events sent to the Worker.
 */
async function handleEvent(event) {
    const urlData = new URL(event.request.url);

    // Handle bot's webhook
    if (urlData.pathname === '/setWebhook') { return setWebhook(urlData); }
    else if (urlData.pathname === '/deleteWebhook') { return deleteWebhook(urlData); }
    else if (urlData.pathname === '/getWebhookInfo') { return getWebhookInfo(urlData); }
    else { return new Response("Invalid URL pathname."); }
}


function setWebhook(urlData) {
    const webhookUrl = `${urlData.protocol}//${urlData.hostname}/endpoint`;
    console.log(webhookUrl)
    return handleWebhook(urlData, 'setWebhook', { url: webhookUrl, secret_token: BOT_API_SECRET });
}

function deleteWebhook(urlData) {
    return handleWebhook(urlData, 'deleteWebhook', { drop_pending_updates: true });
}

function getWebhookInfo(urlData) {
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

    let query = '';
    if (params) {
        query = '?' + new URLSearchParams(params).toString();
    }

    const apiUrl = `https://api.telegram.org/bot${bot_api_token}/${methodName}${query}`;
    const r = await (await fetch(apiUrl)).json();

    return new Response(JSON.stringify(r));
}


// async function get_preferred_lang() {
//     const lang = await kv_bot_prefs.get("LANG");
// 
//     if (lang === null) {
//         await kv_bot_prefs.put("LANG", "ua");
//         // return new Response("Value not found", { status: 404 });
//     }
//     
//     return lang;
// }

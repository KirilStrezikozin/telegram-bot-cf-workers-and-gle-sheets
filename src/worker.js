/**
 * Visit README.md in the project root for usage guide.
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const lang = await kv_bot_prefs.get("LANG")

    if (lang === null) {
        await kv_bot_prefs.put("LANG", "ua")
        // return new Response("Value not found", { status: 404 });
    }

    return new Response(lang)
}

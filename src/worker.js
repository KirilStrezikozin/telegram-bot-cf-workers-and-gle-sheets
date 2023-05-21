/**
 * All guides and information is outlined in README.md in the root.
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

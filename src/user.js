/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */


/*
 * Get user's preferred language
 */
export async function getLang(userId) {
    // Get user's preferred language
    let lang = await kv_bot_prefs.get(`LANG_${userId}`);

    // If not found, put a new LANG entry for the user
    if (lang === null) {
        await kv_bot_prefs.put(`LANG_${userId}`, "ua");
        lang = "ua";
    }

    return lang;
}

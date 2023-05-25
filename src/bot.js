/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import { getReply } from "./reply";
import { Webhook } from "./webhook";


export class Bot {
    constructor(worker_url, bot_api_token, bot_api_secret) {
        this.bot_api_token = bot_api_token;
        this.bot_api_secret = bot_api_secret;
        this.api_url = `https://api.telegram.org/bot${bot_api_token}`;
        this.webhook = new Webhook(worker_url, bot_api_token, bot_api_secret);
        this.user_lang = "ua";
        this.is_alive = true;
    }

    async update(request) {
        const content = await request.json();

        try {
            // Handle incoming message from the user
            if ('message' in content) {
                await this.getUserLang(content.message.from.id);
                await this.handleMessage(content.message);
            }

            // Handle inline callback_query from the user
            else if ('callback_query' in content) {
                await this.getUserLang(content.callback_query.from.id);
                await this.handleCallbackQuery(content.callback_query);
            }

            else console.log("Unhandled request content:\n" + content);
        }
        catch (error) {
            console.log(error);
            return this.error(error, 400);
        }

        return new Response("Ok.", { status: 200 });
    }

    async handleMessage(message) {
        // Reply to text message
        if (message.hasOwnProperty('text')) {
            // text lowered and with no spaces
            const text_lns = message.text.toLowerCase().replace(/\s+/g, "");

            if (message.text.includes('/start')) {
                const welcome_msg = getReply("welcome", this.user_lang, message.from.first_name);
                const help_msg = getReply("help", this.user_lang);

                await this.sendMessage(message.chat.id, welcome_msg, [
                    { text: getReply("invoke_about_us", this.user_lang), callback_data: 'invoke_about_us' }]);
                await this.sendMessage(message.chat.id, help_msg);

            } else if (message.text.includes('/stop')) {
                const stop_reply = getReply("stop", this.user_lang, message.from.first_name);
                
                const stop_msg = stop_reply[0];
                const bye_replies = stop_reply[1];
                const index = Math.floor(Math.random() * bye_replies.length);
                const bye_reply = bye_replies[index];

                await this.sendMessage(message.chat.id, stop_msg + bye_reply);

            } else if (message.text.includes('/help')) {
                const help_msg = getReply("help", this.user_lang);

                await this.sendMessage(message.chat.id, help_msg);

            } else if (message.text.includes('/language')) {
                const lang_msg = getReply("language", this.user_lang);

                await this.sendMessage(message.chat.id, lang_msg, [
                    { text: "🇺🇦 Українська", callback_data: 'set_lang_ua' },
                    { text: "🇺🇸 English", callback_data: 'set_lang_en' }]);

            } else if (message.text.includes('/about')) {
                await this.sendMessage(message.chat.id, getReply("about_us", this.user_lang),
                    getReply("about_us_keyboard", this.user_lang));

            } else if (text_lns.includes("привіт") || text_lns.includes("hi") || text_lns.includes("hey") || text_lns.includes("hello")) {
                await this.sendMessage(message.chat.id, "👋");
                await this.replyRandom(message.chat.id, "hi");

            } else if (text_lns.includes("дякую") || text_lns.includes("thank")) {
                await this.sendMessage(message.chat.id, "🙏");
                await this.replyRandom(message.chat.id, "thanks");

            } else if (text_lns.includes("bye") || text_lns.includes("допобачення") || text_lns.includes("дозустрічі") || text_lns.includes("бувай") || text_lns.includes("прощавай")) {
                await this.sendMessage(message.chat.id, "🥺");

                const stop_reply = getReply("stop", this.user_lang);
                const bye_replies = stop_reply[1];
                const index = Math.floor(Math.random() * bye_replies.length);

                await this.sendMessage(message.chat.id, bye_replies[index]);


            } else {
                await this.replyRandom(message.chat.id, "invalid");
            }
        
        // Reply to other types of messages
        } else {
            await this.replyRandom(message.chat.id, "invalid");
        }
    }

    async handleCallbackQuery(callback_query) {
        if (!callback_query.hasOwnProperty('message')) {
            console.log("while handleCallbackQuery, no message found as field of callback_query");
            return;
        }

        const { data, message } = callback_query;

        if (data.includes('set_lang')) {
            const newUserLang = data.replace('set_lang_', '')
            await this.setUserLang(callback_query.from.id, newUserLang);

            await this.sendMessage(message.chat.id, getReply("language_set", this.user_lang));
            await this.sendMessage(message.chat.id, getReply("language_emoji", this.user_lang));

        } else if (data === 'invoke_about_us') {
            await this.sendMessage(message.chat.id, getReply("about_us", this.user_lang),
                getReply("about_us_keyboard", this.user_lang));

        } else {
            await this.replyRandom(callback_query.message.chat.id, "invalid");
        }
    }

    async replyRandom(chatId, replyType) {
        const replies = getReply(replyType, this.user_lang);
        const index = Math.floor(Math.random() * replies.length);

        await this.sendMessage(chatId, replies[index]);
    }

    async getUserLang(userId) {
        const userIdStr = userId.toString();
        let lang = "ua";

        const stored_lang = await kv_bot_prefs.get(`LANG_${userIdStr}`);

        if (stored_lang) {
            lang = stored_lang.toString();
        } else {
            await kv_bot_prefs.put(`LANG_${userIdStr}`, "ua");
            lang = "ua";
        }

        this.user_lang = lang;
    }

    async setUserLang(userId, value) {
        const userIdStr = userId.toString();

        await kv_bot_prefs.put(`LANG_${userIdStr}`, value.toString());

        this.user_lang = value;
    }

    async sendMessage(chatId, text, buttons = null) {
        if (buttons) {
            await this.callApi('sendMessage', { chat_id: chatId, text: text, parse_mode: 'Markdown',
                reply_markup: JSON.stringify({ inline_keyboard: [buttons] }) });
        } else {
            await this.callApi('sendMessage', { chat_id: chatId, text: text, parse_mode: 'Markdown' });
        }
    }

    async answerCallbackQuery(callbackQueryId, text) {
        return this.callApi('answerCallbackQuery', { callback_query_id: callbackQueryId, text: text });
    }

    async callApi(methodName, params = null) {
        let query = '';
        if (params) {
            query = '?' + new URLSearchParams(params).toString();
        }

        const apiUrl = `https://api.telegram.org/bot${this.bot_api_token}/${methodName}${query}`;

        const response = await fetch(apiUrl);
        const result = await response.json();
        console.log(result);
    }

    error(message, status) {
        const info = {
            status: status,
            headers: { 'content-type': 'application/json' }
        };

        return new Response(JSON.stringify(message, null, 2), info);
    }
}

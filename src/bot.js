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
                //await this.getUserLang(request.content.message.from.id);
                await this.handleMessage(content.message);
            }

            // Handle inline callback_query from the user
            else if ('callback_query' in content) {
                //await this.getUserLang(request.content.callback_query.from.id);
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
            if (message.text.includes('/start')) {
                const welcome_msg = getReply("welcome", this.user_lang, message.from.first_name);
                const help_msg = getReply("help", this.user_lang);

                await this.sendMessage(message.chat.id, welcome_msg)
                await this.sendMessage(message.chat.id, help_msg)

            } else if (message.text.includes('/help')) {
                const help_msg = getReply("help", this.user_lang);

                await this.sendMessage(message.chat.id, help_msg);

            } else if (message.text.includes('/language')) {
                const lang_msg = getReply("language", this.user_lang);

                await this.sendMessage(message.chat.id, lang_msg, [
                    { text: "🇺🇦 Українська", callback_data: 'set_lang_ua' },
                    { text: "🇺🇸 English", callback_data: 'set_lang_en' }]);

            } else {
                const invalid_msgs = getReply("invalid", this.user_lang);
                const invalid_index = Math.floor(Math.random() * invalid_msgs.length);

                await this.sendMessage(message.chat.id, invalid_msgs[invalid_index])
            }
        }

        // Reply to other types of messages
        else {
            const invalid_msgs = getReply("invalid", this.user_lang);
            const invalid_index = Math.floor(Math.random() * invalid_msgs.length);

            await this.sendMessage(message.chat.id, invalid_msgs[invalid_index])
        }
    }

    async handleCallbackQuery(callback_query) {
        const invalid_msgs = getReply("invalid", this.user_lang);
        const invalid_index = Math.floor(Math.random() * invalid_msgs.length);

        await this.sendMessage(callback_query.from.id, invalid_msgs[invalid_index])
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
                reply_markup: JSON.stringify({ inline_keyboard: buttons }) });
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

        await fetch(apiUrl);
    }

    error(message, status) {
        const info = {
            status: status,
            headers: { 'content-type': 'application/json' }
        };

        return new Response(JSON.stringify(message, null, 2), info);
    }
}

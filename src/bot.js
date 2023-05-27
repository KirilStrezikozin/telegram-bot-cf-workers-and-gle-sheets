/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Detailed information can be found at https://developers.cloudflare.com/workers/
 */

import { getReply } from "./reply";
import { Webhook } from "./webhook";
import { Spreadsheet } from "./gle_sheets";


export class Bot {
    constructor(worker_url, bot_api_token, bot_api_secret) {
        this.bot_api_token = bot_api_token;
        this.bot_api_secret = bot_api_secret;
        this.api_url = `https://api.telegram.org/bot${bot_api_token}`;

        this.webhook = new Webhook(worker_url, bot_api_token, bot_api_secret);
        this.spreadsheet = new Spreadsheet();

        this.user_lang = "ua";
        this.sendMessageDelay = 400;
        this.helpEventLength = 25;
        this.helpEventSearchTrials = 20;

        this.is_alive = true;
        this.lastSentMessageId = null;
    }

    async update(request) {
        const content = await request.json();
        await this.spreadsheet.launch();

        try {
            // Handle incoming message from the user
            if ('message' in content) {
                console.log("Replying to: " + content.message.text);
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
                await this.sendWelcome(message);
                await this.sendHelp(message);

            } else if (message.text.includes('/stop')) {
                await this.sendStop(message);

            } else if (message.text.includes('/help')) {
                await this.sendHelp(message);

            } else if (message.text.includes('/language')) {
                await this.sendLangToggle(message);

            } else if (message.text.includes('/random')) {
                // unsupported in browser version
                 await this.sendDice(message.chat.id);

                // can use this indtead, but no animation
                // await this.sendMessage(message.chat.id, '🎰');

            } else if (message.text.includes('/about')) {
                await this.sendMessage(message.chat.id, getReply("about_us", this.user_lang),
                    getReply("about_us_keyboard", this.user_lang));

            } else if (message.text.includes('/lifehack')) {
                await this.sendLifehack(message);

            } else if (message.text.includes("🔎 Sources") || message.text.includes("🔎 Джерела")) {
                await this.replyLifehack(message, "source");

            } else if (message.text.includes("🕵️ Understand the period") || message.text.includes("🕵️ Розуміння періоду")) {
                await this.replyLifehack(message, "understand");

            } else if (message.text.includes("🧠 Memorizing dates") || message.text.includes("🧠 Запам'ятовування дат")) {
                await this.replyLifehack(message, "memory");

            } else if (message.text.includes("🥇 Learn more") || message.text.includes("🥇 Як дізнатися більше")) {
                await this.replyLifehack(message, "more");

            } else if (message.text.includes("📖 Literature") || message.text.includes("📖 Література")) {
                await this.replyLifehack(message, "read");

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
                // searching word to imitate search progress
                const searching_word = this.getRandomReply("searching_process");
                await this.sendMessage(message.chat.id, "🔎");
                await this.sendMessage(message.chat.id, searching_word);

                await this.searchAndSendEntry(message.chat.id, message.text, true, this.sendMessageDelay);

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

        } else if (data === 'invoke_lifehacks') {
            const lifehack_msg = this.getRandomReply("invoke_lifehack_again");

            const lifehack_replies = getReply("lifehack", this.user_lang, message.from.first_name);
            const lifehack_keyboard = lifehack_replies[1];

            await this.sendMessage(message.chat.id, lifehack_msg, null, lifehack_keyboard);

        } else if (data.includes('search_multiple_')) {
            console.log("Callback data is", data);
            await this.replyRandom(message.chat.id, "invalid");

        } else if (data.includes('search_')) {
            let sendDelay = 0;

            if (!data.includes('_nosearchimitate_')) {
                // searching word to imitate search progress
                const searching_word = this.getRandomReply("searching_process");
                await this.sendMessage(message.chat.id, "🔎");
                await this.sendMessage(message.chat.id, searching_word);

                sendDelay = 800;
            }

            try {
                let entry_data = data.replace("search_", "").replace("nosearchimitate_", "").split("_");
                const entry_index = parseInt(entry_data[0]);

                const delMsgIndex = parseInt(entry_data[1]);

                if (delMsgIndex || null !== null) {
                    await this.deleteMessage(message.chat.id, delMsgIndex, 0);
                }

                await this.composeAndSendEntry(message.chat.id, entry_index, true, sendDelay);
            }

            catch (error) {
                console.log(error);
                await this.replyRandom(message.chat.id, "invalid");
            }

        } else {
            console.log("Callback data is", data);
             await this.replyRandom(message.chat.id, "invalid");
        }
    }

    /*
     * Get random element in array.
     * If subindex is not -1, value = arr[index][subindex]
     */
    getRandomInArray(arr, sub = -1) {
        let value = "";
        const index = Math.floor(Math.random() * arr.length);

        if (sub === -1) value = arr[index];
        else value = arr[index][sub];

        if (value === "") {
            value = "400 Bad Request: value is empty";
        }

        return [value, index];
    }

    /*
     * Get random element in array the length of which is less than this.helpEventLength.
     * If subindex is not -1, value = arr[index][subindex]
     */
    getRandomHelpEvent(arr, sub = -1) {
        let value = "";
        let index = -1;
        let trial = 0;
        let cache = new Map([]);

        while (index === -1) {
            index = Math.floor(Math.random() * arr.length);
            if (sub === -1) value = arr[index];
            else value = arr[index][sub];

            if (cache.get(index)) {
                continue
            } else if (value === "") {
                value = "400 Bad Request: value is empty";
            }

            if (trial >= this.helpEventSearchTrials) {
                break;
            } else if (value.length > 20) {
                cache[index] = true;
                index = -1;
                // console.log(`${trial} trial went with ${value}`);
                trial++;
            } else break;
        }

        return [value, index];
    }

    getRandomReply(replyType) {
        const replies = getReply(replyType, this.user_lang);
        const index = Math.floor(Math.random() * replies.length);
        return replies[index];
    }

    async replyRandom(chatId, replyType) {
        const reply = this.getRandomReply(replyType);

        await this.sendMessage(chatId, reply);
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

    async deleteUserLang(userId) {
        const userIdStr = userId.toString();

        await kv_bot_prefs.delete(`LANG_${userIdStr}`);
        // this.user_lang = "ua";
    }

    async sendWelcome(message) {
        const welcome_msg = getReply("welcome", this.user_lang, message.from.first_name);

        await this.sendMessage(message.chat.id, welcome_msg, [
            [{ text: getReply("invoke_about_us", this.user_lang), callback_data: 'invoke_about_us' }]
        ]);
    }

    async sendHelp(message) {
        const help_msg = getReply("help", this.user_lang, message.from.first_name);
        const values = await this.spreadsheet.getNamedValues("title", this.user_lang);

        const [title, index] = this.getRandomHelpEvent(values, 0);

        const data = `search\_${index}`;
        const searchWord = getReply("search_word", this.user_lang);
        const text = `${searchWord}: ${title}`;
        await this.sendMessage(message.chat.id, help_msg, [
            [{ text: text, callback_data: data}]
        ]);
    }

    async sendLangToggle(message) {
        const lang_msg = getReply("language", this.user_lang);

        await this.sendMessage(message.chat.id, lang_msg, [
            [{ text: "🇺🇦 Українська", callback_data: 'set_lang_ua' },
             { text: "🇺🇸 English", callback_data: 'set_lang_en' }]
        ]);
    }

    async sendStop(message) {
        const stop_reply = getReply("stop", this.user_lang, message.from.first_name);
        
        const stop_msg = stop_reply[0];
        const bye_replies = stop_reply[1];
        const index = Math.floor(Math.random() * bye_replies.length);
        const bye_reply = bye_replies[index];

        await this.deleteUserLang(message.from.id);

        await this.sendMessage(message.chat.id, stop_msg + bye_reply);
    }

    async sendLifehack(message) {
        const lifehack_replies = getReply("lifehack", this.user_lang, message.from.first_name);

        const lifehack_msg = lifehack_replies[0];
        const lifehack_keyboard = lifehack_replies[1];
        await this.sendMessage(message.chat.id, lifehack_msg, null, lifehack_keyboard);
    }

    async replyLifehack(message, type) {
        const lifehacks = getReply("lifehack", this.user_lang, message.from.first_name);
        const lifehack_replies = lifehacks[2].get(`lifehack_${type}`);

        for (let i = 0; i < lifehack_replies.length - 1; i++) {
            await this.sendMessage(message.chat.id, lifehack_replies[i]);
        }

        // send last life hack with a button to query reply keyboard again
        await this.sendMessage(message.chat.id, lifehack_replies[lifehack_replies.length - 1], [
            { text: getReply("lifehack_again", this.user_lang), callback_data: "invoke_lifehacks"}
        ]);
    }

    async sendMessage(chatId, text, buttons = null, keyboard = null, disable_notification = false) {
        await this.sendDelay(this.sendMessageDelay, chatId);

        if (buttons) {
            await this.callApi('sendMessage', { chat_id: chatId, text: text,
                parse_mode: 'Markdown', disable_notification: disable_notification,
                reply_markup: JSON.stringify({ inline_keyboard: buttons }) });

        } else if (keyboard) {
            await this.callApi('sendMessage', { chat_id: chatId, text: text,
                parse_mode: 'Markdown', disable_notification: disable_notification,
                reply_markup: JSON.stringify( {keyboard: keyboard, one_time_keyboard: true }) });

        } else {
            await this.callApi('sendMessage', { chat_id: chatId, text: text,
                parse_mode: 'Markdown', disable_notification: disable_notification });
        }
    }

    async deleteMessage(chatId, messageId, delay = 0) {
        await this.sendDelay(delay);
        await this.callApi('deleteMessage', { chat_id: chatId, message_id: messageId });
    }

    async sendDice(chatId) {
        await this.sendDelay(this.sendMessageDelay, chatId, 'choose_sticker');
        await this.callApi('sendDice', { chat_id: chatId, emoji: '🎰' });

        const values = await this.spreadsheet.getNamedValues("title", this.user_lang);

        const [raw_title, index] = this.getRandomInArray(values, 0);
        const title = (raw_title.trim().charAt(0).toUpperCase() + raw_title.substring(1)).replaceAll("\n", " ").trim();

        const searchWord = getReply("searching_word", this.user_lang);

        const text = `${searchWord}${title}`;
        await this.sendMessage(chatId, text);

        await this.composeAndSendEntry(chatId, index, true, 1500);
    }

    getEntryContent(values) {
        const entry = values[0];
        console.log(entry);

        const title = (entry[2].trim().charAt(0).toUpperCase() + entry[2].substring(1)).replaceAll("\n", " ").trim().replace(/\s+/g, " ");
        const date = entry[3].toLowerCase().replaceAll("\n", " ").trim().replace(/\s+/g, " ");
        const description = (entry[4].charAt(0).toUpperCase() + entry[4].substring(1)).replaceAll("\n", " ").trim().replace(/\s+/g, " ");

        return [title, date, description];
    }

    async sendEntry(chatId, values, delete_last, delete_delay) {
        const [title, date, description] = this.getEntryContent(values);
        const description_emoji = this.getRandomReply("entry_description_emoji");

        console.log(title);
        console.log(date);
        console.log(description);

        const entry_msg = `📌 *${title}*\n\n📅 _${date}_\n\n${description_emoji} ${description}`;
        // console.log(entry_msg);

        // wait and delete searching word
        if (delete_last) await this.deleteMessage(chatId, this.lastSentMessageId, delete_delay);

        const oldDelay = this.sendMessageDelay;
        this.sendMessageDelay = 0; // fixed delay

        await this.sendMessage(chatId, entry_msg);

        this.sendMessageDelay = oldDelay;
    }

    async composeAndSendEntry(chatId, entry_index, delete_last, delete_delay = 0) {
        const values = await this.spreadsheet.getEntry(entry_index);
        await this.sendEntry(chatId, values, delete_last, delete_delay);
    }

    async searchAndSendEntry(chatId, text_query, delete_last, delete_delay = 0) {
        if (text_query === "") {
            await this.replyRandom(chatId, "invalid");
            return;
        }

        const ids = await this.spreadsheet.searchEntries(text_query, this.user_lang);
        console.log("Received ids:", ids);

        if (!ids.length) {
            if (delete_last) await this.deleteMessage(chatId, this.lastSentMessageId, delete_delay);

            const not_found_msg = this.getRandomReply("search_not_found");
            await this.sendMessage(chatId, not_found_msg);

        } else if (ids.length === 1) {
            if (delete_last) await this.deleteMessage(chatId, this.lastSentMessageId, delete_delay);

            await this.composeAndSendEntry(chatId, ids[0], false);

        } else if (ids.length <= 3) {
            const search_choose_exact_text = getReply("search_choose_exact", this.user_lang);
            const description_emoji = this.getRandomReply("entry_description_emoji");

            let buttons = new Array(new Array(ids.length), [null]);
            let titles = "";
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const values = await this.spreadsheet.getEntry(id);
                const [title, date, ..._] = this.getEntryContent(values);

                let date_end_dot = ".";
                if (date[date.length - 1] === ".") date_end_dot = "";
                titles += `👇 *${i + 1}.* ${title}.\n - _${date}_${date_end_dot}\n\n`;
                buttons[0][i] = { text: `${i + 1}`, callback_data: `search_nosearchimitate_${id}` };
            }

            buttons[1][0] = { text: getReply("all_word", this.user_lang), callback_data: `search_multiple_${[...ids]}` };

            if (delete_last) await this.deleteMessage(chatId, this.lastSentMessageId, 0);

            const oldDelay = this.sendMessageDelay;
            this.sendMessageDelay = 0;

            const search_choose_exact_msg = `${description_emoji} ${search_choose_exact_text}${titles}`;
            await this.sendMessage(chatId, search_choose_exact_msg, buttons);

            this.sendMessageDelay = oldDelay;

        } else {
            await this.sendMessage(chatId, ids);
        }
    }

    async answerCallbackQuery(callbackQueryId, text) {
        return this.callApi('answerCallbackQuery', { callback_query_id: callbackQueryId, text: text });
    }

    /*
     * Send a chat action (hint that bot is typing something) and
     * wait the given amount of milliseconds to not blow user's ears off with a bazillion of replies sent in a split second.
     */
    async sendDelay(ms, chatId = null, chatAction = 'typing') {
        if (chatId) {
            this.callApi('sendChatAction', { chat_id: chatId, action: chatAction});
        }

        await new Promise(response => setTimeout(response, ms));
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

        // capture last sent message id
        if (methodName === 'sendMessage') this.lastSentMessageId = result.result.message_id;
    }

    error(message, status) {
        const info = {
            status: status,
            headers: { 'content-type': 'application/json' }
        };

        return new Response(JSON.stringify(message, null, 2), info);
    }
}

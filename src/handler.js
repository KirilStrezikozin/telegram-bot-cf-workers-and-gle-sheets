/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 *
 * Handle Worker requests.
 */

import { Bot } from './bot.js'


export class Handler {
    constructor(bot_api_token, bot_api_secret) {
        this.bot_api_token = bot_api_token;
        this.bot_api_secret = bot_api_secret;
        this.response = new Response();
    }

    async handle(request) {
        if (!this.bot_api_token || !this.bot_api_secret) {
            this.response = this.error("Bot API token or secret not provided.", 401);
        }

        const url = new URL(request.url);
        await this.processRequest(request);

        this.bot = new Bot(url, this.bot_api_token, this.bot_api_secret);
        
        if (!this.bot.is_alive) {
            this.response = this.error("Telegram bot not found", 404);
        }

        // Process webhook
        else if (this.request.method === 'GET') {
            if (url.searchParams.get('bot') === this.bot_api_token) {
                this.response = await this.bot.webhook.process(url);
            } else {
                this.response = this.error("Provide bot parameter in the URL representing the bot API token.", 403);
            }
        }

        // Handle bot update
        else if (this.request.method === 'POST' && this.request.secret === this.bot_api_secret) {
            if (this.request.size > 6 && this.request.content_type.includes('application/json')) {
                this.response = await this.bot.update(this.request);
            } else {
                this.response = this.error("Invalid request content-type or body", 400);
            }
        }

        else this.response = this.error("Bad or invalid request.", 400);

        return this.response;
    }

    async processRequest(request) {
        this.request = request;

        this.request.size = parseInt(this.request.headers.get('content-length')) || 0;
        this.request.content_type = this.request.headers.get('content-type') || '';
        this.request.secret = this.request.headers.get('X-Telegram-Bot-Api-Secret-Token') || '';
    }

    error(message, status) {
        const info = {
            status: status,
            headers: { 'content-type': 'application/json' }
        };

        return new Response(JSON.stringify(message, null, 2), info);
    }
}

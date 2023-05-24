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
        this.request = this.processRequest(request);

        this.bot = new Bot(url, this.bot_api_token, this.bot_api_secret);
        
        console.log(this.request.method);
        if (!this.bot.is_active) {
            this.response = this.error("Telegram bot not found", 404);
        }

        // Process webhook
        else if (this.request.method === 'GET') {
            console.log(this.bot_api_token);
            console.log(url.searchParams.get('bot'));
            if (url.searchParams.get('bot') === this.bot_api_token) {
                this.response = await this.bot.webhook.process(url);
            } else {
                this.response = this.error("Provide bot parameter in the URL representing the bot API token.", 403);
            }
        }

        // Handle bot update
        else if (this.request.method === 'POST' && this.request.secret === this.bot_api_secret) {
            //if (this.request.size > 6 && this.request.content.message && this.request.content_type.includes('application/json')) {
            if (this.request.size > 6 && this.request.content_type.includes('application/json')) {
                this.response = await this.bot.update(this.request);
            } else {
                this.response = this.error("Invalid request content type or body", 403);
            }
        }

        else this.response = this.error("Bad or invalid request.", 400);

        return this.response;
    }

    async processRequest(req) {
        let request = req;
        request.size = parseInt(request.headers.get('content-length')) || 0;
        request.content_type = parseInt(request.headers.get('content-type')) || '';
        request.secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token') || '';

        if (request.size && request.content-type) {
            request.content = await this.getRequestContent(request);
        } else {
            request.content = { message: '' };
        }

        return request;
    }

    async getRequestContent(request) {
        if (request.content_type.includes('application/json')) return await request.json();
        else if (request.content_type.includes('text/')) return await request.text();
        else return { message: '' };
    }

    error(message, status) {
        const info = {
            status: status,
            headers: { 'content-type': 'application/json' }
        };

        return new Response(JSON.stringify(message, null, 2), info);
    }
}

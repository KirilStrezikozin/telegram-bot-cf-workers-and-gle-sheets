/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Handle webhook GET requests.
 */


export class Webhook {
    constructor(worker_url, bot_api_token, bot_api_secret) {
        this.bot_api_token = bot_api_token;
        this.bot_api_secret = bot_api_secret;
        this.worker_url = worker_url; // Worker URL
        this.api_url = `https://api.telegram.org/bot${bot_api_token}`;
    }

    async process(url) {
        switch (url.pathname) {
            case 'setWebhook':
                return await this.set();
            case 'getWebhookInfo':
                return await this.getInfo();
            case 'deleteWebhook':
                return await this.unset();
            case 'getMe':
                return await this.getMe();

            default:
                return this.error("Invalid URL pathname", 400);
        }
    }

    async set() {
        return await this.handle(this.api_url + `setWebhook?url=${this.url}&secret_token=${this.bot_api_secret}`);
    }

    async getInfo() {
        return await this.handle(this.api_url + `getWebhookInfo`);
    }

    async unset() {
        return await this.handle(this.api_url + `deleteWebhook`);
    }

    async getMe() {
        return await this.handle(this.api_url + `getMe`);
    }

    async handle(url) {
        const url_bot_token = this.worker_url.searchParams.get("bot") || '';

        if (url_bot_token === this.bot_api_token) {
            const response = await fetch(url);
            const result = await response.json();
            
            const info = {
                status: 200,
                headers: { 'content-type': 'application/json' }
            };

            return new Response(JSON.stringify(result, null, 2), info);
        }

        else return this.error("Expected bot API token and bot token in the URL parameters did not match.", 401);
    }

    error(message, status) {
        const info = {
            status: status,
            headers: { 'content-type': 'application/json' }
        };

        return new Response(JSON.stringify(message, null, 2), info);
    }
}

# telegram-bot-cf-workers-and-gle-sheets
> Telegram bot that interacts with [Cloudflare Workers](https://developers.cloudflare.com/workers/) and utilizes [Google Sheets](https://developers.google.com/sheets/api/guides/concepts) for data storage. No dependencies and no packages are required.

> Just create and deploy a worker, create a bot with BotFather, create GoogleCloud free tier account, and set sheets webhook - that's all there's to it. Adress the guide below.

# Contents

- [Get Started with Workers](#get-started-with-workers)
- [Installation](#installation)
- [Deploy](#deploy)
- [KVs, Secrets and Vars](#variables)
- [Webhook](#webhook)

# Get Started with Workers

## Create a Worker

You can check out this [small workers beginner course](https://egghead.io/lessons/cloudflare-create-a-cloudflare-workers-account).
    
    # supposing you've got a repo created
    $ git clone https://github.com/USERNAME/REPO_NAME && cd REPO_NAME
    
    # might require sudo
    $ npm init cloudflare my-worker worker
   
After I decided to move scripts from `my-worker/` into `src/` and config files into the project root.

# Installation

    $ git clone https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets.git
    $ cd telegram-bot-cf-workers-and-gle-sheets
    
# Deploy

To preview worker locally, run the following:

    $ npx wrangler dev --remote
    # open a link in your browser
    
To publish local changes to Cloudflare:

1. Make sure you're logged in:

        $ npx wrangler login
    
2. Add your Cloudflare `account_id` to `wrangler.toml`:

        # you can view account details
        $ npx wrangler whoami
    
3. Deploy your Worker:

        $ npx wrangler deploy

4. Connect a new webhook to the bot with the key you received from BotFather:
        
        # in your browser
        $ <YOUR_WORKER_URL>/setWebhook?bot=<BOT_API_TOKEN>

5. Create [secrets](#variables): `BOT_API_TOKEN` (from BotFather), `BOT_API_SECRET` (info how [here](https://core.telegram.org/bots/api#setwebhook)), `ADMIN_CHAT_ID` (for maintenance messages - you can create it later when you know admin chat id).

7. `SHEET_API_TOKEN` and `SHEET_ID` secrets (great and full guide [here](https://github.com/bpk68/g-sheets-api#set-up-a-google-sheet), this bot doesn't use `g-sheets-api` package though).

8. Redeploy and that's it.
    
# Variables

- Secrets and environment variables can be added via the Cloudflare Worker Dashboard. You can also add them via your terminal:

      $ npx wrangler secret put <KEY>
      
- Add Environmental Variables to `wrangler.toml`. More info [here](https://developers.cloudflare.com/workers/platform/environment-variables/):

     ```toml
     # wrangler.toml
     
     [vars]
     LANG = "en"
     ```

- Access Secret Keys and Vars. Nice tutorial [here](https://egghead.io/lessons/cloudflare-use-workers-secrets-to-securely-store-api-credentials):

```javascript
// ES Worker
env.SOME_API_KEY
```
```javascript
// Service Worker
SOME_API_KEY
```

- Add and use KVs. More info [here](https://developers.cloudflare.com/workers/runtime-apis/kv/):
           
        # add KV namespace
        $ npx wrangler kv:namespace create <NAMESPACE_BINDING>
        
        # put a key-value pair into the namespace
        $ npx wrangler kv:key put --binding=<NAMESPACE_BINDING> "<KEY>" "<VALUE>"
        
```javascript
// Service Worker

const lang = await kv_bot_prefs.get("LANG");

if (lang === null) {
    await kv_bot_prefs.put("LANG", "en");
}

```

# Webhook

Bot can receive updates via an outgoing webhook. More info on webhooks [here](https://core.telegram.org/bots/api#setwebhook). `src/worker.js` comes with a several functions to set up a webhook. In order for them to work, ensure `BOT_API_TOKEN` and `BOT_API_SECRET` were added as worker secrets.

1. Set a Webhook

        # You can open a link in your browser to set up a webhook directly:
        https://api.telegram.org/bot<YOUR_BOT_API>/setWebhook?url=<YOUR_WEBHOOK_URL>&secret_token=<YOUR_WEBHOOK_SECRET_TOKEN>
        
   
   It is recommended to manage Webhooks locally, but this worker also provides the ability to set it from your worker url. For additional security (so that no one else just opens the link and resets the webhook), provide your `BOT_API_TOKEN` as `bot` parameter: 
        
        # In your browser:
        <YOUR_WORKER_URL>/setWebhook?bot=<BOT_API_TOKEN>
        
        # Response:
        {"ok":true,"result":true,"description":"Webhook was set"}
        
2. Similarly to **1**, use these urls to Delete webhook or get info about it. The returned response is stringified json out of the fetched url request to telegram api.

        # In your browser:
        <YOUR_WORKER_URL>/deleteWebhook?bot=<BOT_API_TOKEN>
        
        # Response:
        {"ok":true,"result":true,"description":"Webhook was deleted"}
        
        # In your browser:
        <YOUR_WORKER_URL>/getWebhookInfo?bot=<BOT_API_TOKEN>
        
        # Response:
        {"ok":true,"result":{"url":"<YOUR_WEBHOOK_URL>","has_custom_certificate":false,"pending_update_count":0}}

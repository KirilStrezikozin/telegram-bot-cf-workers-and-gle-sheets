# telegram-bot-cf-workers-and-gle-sheets
> Telegram bot that interacts with [Cloudflare Workers](https://developers.cloudflare.com/workers/) and utilizes [Google Sheets](https://developers.google.com/sheets/api/guides/concepts) for data storage.

> **Note**: Currently under active development.

# Contents

- [Get Started with Workers](#get-started-with-workers)
- [Installation](#installation)
- [Deploy](#deploy)
- [Secrets and Vars](#secrets-and-vars)

# Get Started with Workers

## Create a Worker
    
    # supposing you've got a repo created
    $ git clone https://github.com/USERNAME/REPO_NAME && cd REPO_NAME
    
    # might require sudo
    $ npm init cloudflare my-worker worker
   
After I decided to move scripts from `my-worker/` into `src/` and config files into the project root.

# Installation

    $ git clone https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets.git
    $ cd telegram-bot-cf-workers-and-gle-sheets
    
# Deploy

To preview worker locally, run:

    $ npx wrangler dev --remote
    # open a link in your browser
    
To publish local changes to Cloudflare, run:

    # make sure you're logged in
    $ npx wrangler login
    
    # you can view account details
    $ npx wrangler whoami
    # account_id has to be added to wrangler.toml
    
    $ npx wrangler deploy
    
# Secrets and Vars

- Secrets and environment variables can be added via the Cloudflare Worker Dashboard. You can also add them via your terminal:

      $ npx wrangler secret put <KEY>
      
- Add Environmental Variables to `wrangler.toml`:

     ```toml
     # wrangler.toml
     
     [vars]
     LANG = "en"
     ```

For Module Workers, Secret Keys and Vars are accessed like so:

```javascript
env.SOME_API_KEY
```

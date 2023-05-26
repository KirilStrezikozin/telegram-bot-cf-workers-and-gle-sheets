/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 * 
 * Google Sheets processor
 */


export class Spreadsheet {
    constructor() {
        this.sheet_api_token = SHEET_API_TOKEN;
        this.sheet_id = SHEET_ID;
        this.api_url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheet_id}`
        this.api_key = `?key=${this.sheet_api_token}`;
    }

    async launch() {
        // get the largest entry index
        await this.getEntriesLength();

        const start_row = 2;
        const end_row = this.n_of_entries + 2;

        // define known ranges
        this.id_range = `events!${start_row}:A${end_row}`;
        this.keywords_range = `events!${start_row}:B${end_row}`;
        this.title_range = `events!${start_row}:C${end_row}`;
        this.date_range = `events!${start_row}:D${end_row}`;
        this.description_range = `events!${start_row}:E${end_row}`;
    }

    async getEntriesLength() {
        const n_of_entries_address = 'index!B2:B2';
        const apiUrl = `${this.api_url}/values/${n_of_entries_address}${this.api_key}`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        const values = data["values"];

        try {
            if (values) {
                this.n_of_entries = parseInt(values[0][0]);
            } else {
                // entries start at row 2
                this.n_of_entries = 2;
            }
        }
        catch (error) {
            console.log(error);
            this.n_of_entries = 2;
        }
    }

    async getValues(range) {
        const apiUrl = `${this.api_url}/values/${range}${this.api_key}`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        const values = data["values"];

        return values;
    }

    async getRandom(field, user_lang) {
        return await this.getValues('index!A1:A1')
    }
}

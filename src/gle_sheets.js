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

    /*
     * Launch a Spreadsheet.
     */
    async launch() {
        // get the largest entry index
        await this.getEntriesLength();

        const start_row = 2;
        const end_row = this.n_of_entries + 2;

        // define known ranges
        this.id_range = `events!A${start_row}:A${end_row}`;
        this.keywords_range = `events!B${start_row}:B${end_row}`;
        this.title_range = `events!C${start_row}:C${end_row}`;
        this.date_range = `events!D${start_row}:D${end_row}`;
        this.description_range = `events!E${start_row}:E${end_row}`;
        this.full_range = `events!A${start_row}:E${end_row}`;
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

    async getNamedValues(field, user_lang) {
        switch (field) {
            case 'id':
                return await this.getValues(this.id_range)
            case 'title':
                return await this.getValues(this.title_range)
            case 'keywords':
                return await this.getValues(this.keywords_range)
            case 'date':
                return await this.getValues(this.date_range)
            case 'description':
                return await this.getValues(this.description_range)
            case 'full':
                return await this.getValues(this.full_range)
            default:
                console.log("While getRandom from Spreadsheet, unknown field encountered: " + field);
                return ["404 Not Found"]; // array is expected
        }
    }

    /* 
     * Return entry (array) of given index from the spreadsheet.
     */
    async getEntry(index) {
        // because first entry is in A2:E2 range;
        const row = index + 2;
        const range = `events!A${row}:E${row}`;

        return await this.getValues(range);
    }

    /*
     * Return array of entries (arrays) matching the given text_query.
     */
    async searchEntries(text_query, user_lang) {
        // escape general punctuation, ignore dashes and quotes. Lowercase. Split by spaces into array of words
        // query = text_query.replace(/[!#$%&()*,./:;<=>?@[\]^_{|}~+]/g, "").toLowerCase().split(/\s+/);
        const p_regex = /[!#$%&()*,./:;<=>?@[\]^_{|}~+]/g;

        const query = text_query.replace(p_regex, " ").toLowerCase();
        // text_query = text_query.toLowerCase();
        console.log("Query: " + query);

        // preallocate matches
        let global_matches = new Array(this.n_of_entries);

        await this.getNamedValues('full', user_lang)
            .then(async values => {
                for (let id = 0; id < values.length; id++) {
                    const text_keywords = values[id][1];

                    let title = values[id][2].replace(p_regex, " ").replace(/\s+/g, " ").trim().toLowerCase();
                    let date = values[id][3].replace(p_regex, " ").replace(/\s+/g, " ").trim().toLowerCase();
                    let description = values[id][4].replace(p_regex, " ").replace(/\s+/g, " ").trim().toLowerCase();

                    if (title === "") title = "?";
                    if (date === "") date = "?";
                    if (description === "") description = "?";

                    // console.log("Values", values);
                    // trim text_keywords, lowercase, replace spaces+commas with commas, split into array of words
                    const keywords = text_keywords.trim().toLowerCase().replace(/[,\s]+/g, ",").split(",")
                        .filter(keyword => {
                            // filter out with no useful content
                            return (keyword.replace(p_regex, "").length > 0 && keyword !== "україн" && keyword !== "ukraine");
                        });
                    // console.log("Keywords:", keywords);

                    // loop overs keywords, check if at least one keyword is present in query
                    // const isMatch = keywords.some(keyword => query.includes(keyword));
                    let local_matches = 0;
                    for (const keyword of keywords) {
                        if (query.includes(keyword)) local_matches++;
                    }

                    // entry receives bonus for fully matching title
                    if (title.includes(query) || query.includes(title) || description.includes(query) || date.includes(query) || query.includes(date)) {
                        local_matches += keywords.length;
                    }

                    // entry is the only match if it fully matches the title
                    if (title === query) {
                        global_matches = new Array(this.n_of_entries);
                        global_matches[id] = 1;
                        break;
                    }

                    global_matches[id] = local_matches;
                }
            });

        console.log(global_matches);
        // sort by number of local matches and filter out unmatched
        const ids = Array.from(global_matches.keys())
            .sort((matches1, matches2) => global_matches[matches2] - global_matches[matches1])
            .filter((id) => global_matches[id] > 0 );

        return ids;
    }
}

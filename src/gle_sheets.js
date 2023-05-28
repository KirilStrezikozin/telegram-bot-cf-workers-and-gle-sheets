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

        // user_lang is not implemented.
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
        // quite impressive website to quickly generate these punctuation regexes: <https://apps.timwhitlock.info/js/regex#>

        const p_regex = /[.,\/#!$%\^&\*;:{}=\-_'‘`~()(-)\[\]{}«»༺-༽᚛-᚜‘-‟‹-›⁅-⁆⁽-⁾₍-₎〈-〉❨-❵⟅-⟆⟦-⟯⦃-⦘⧘-⧛⧼-⧽⸂-⸅⸉-⸊⸌-⸍⸜-⸝⸠-⸩〈-】〔-〛〝-〟﴾-﴿︗-︘︵-﹄﹇-﹈﹙-﹞（-）［］｛｝｟-｠｢-｣]+/g;
        const p_simple_regex = /[(-)\[\]{}«»༺-༽᚛-᚜'‘‘-‟‹-›⁅-⁆⁽-⁾₍-₎〈-〉❨-❵⟅-⟆⟦-⟯⦃-⦘⧘-⧛⧼-⧽⸂-⸅⸉-⸊⸌-⸍⸜-⸝⸠-⸩〈-】〔-〛〝-〟﴾-﴿︗-︘︵-﹄﹇-﹈﹙-﹞（-）［］｛｝｟-｠｢-｣]+/g;

        const query = text_query.replace(p_simple_regex, "").toLowerCase();
        if (query === "") return [];

        // preallocate matches
        let global_matches = new Array(this.n_of_entries);

        // do this number of iterations to remove min values from search if there're the ones with bonuses
        let minFloor = 0;
        // in how many iterations of minFloor to ignore break if the number of entries <= 3
        let skipTrimFloor = 0;

        await this.getNamedValues('full', user_lang)
            .then(async values => {
                for (let id = 0; id < values.length; id++) {
                    const text_keywords = values[id][1];

                    let title = values[id][2].replace(p_simple_regex, "").replace(/\s+/g, " ").trim().toLowerCase();
                    let date = values[id][3].replace(p_simple_regex, "").replace(/\s+/g, " ").trim().toLowerCase();
                    let description = values[id][4].replace(p_simple_regex, "").replace(/\s+/g, " ").trim().toLowerCase();

                    // empty into "?", "?" is escaped in the query, so it won't match
                    if (title === "") title = "?";
                    if (date === "") date = "?";
                    if (description === "") description = "?";

                    // trim text_keywords, lowercase, replace spaces + commas with commas, split into array of words
                    const keywords = text_keywords.trim().toLowerCase().replace(/,\s+/g, ",").replace(/\s+/g, " ").split(",")
                        .filter(keyword => {
                            // filter out with no useful content
                            return (keyword.replace(p_regex, "").length > 0 && keyword !== "україн" && keyword !== "ukraine");
                        });

                    // if just need to know if matching:
                    // const isMatch = keywords.some(keyword => query.includes(keyword));

                    // loop over keywords, check if at least one keyword is present in the query
                    let local_matches = 0;
                    for (const keyword of keywords) {
                        if (query.includes(keyword)) local_matches++;
                    }

                    // entry receives bonus for fully matching title
                    if (title.includes(query) || query.includes(title) || date.includes(query) || query.includes(date)) {
                        local_matches += keywords.length;
                        minFloor++;
                    }

                    // because query can include just a year in a date, so we need our minFloor trimming to go for a bit longer
                    if (date.includes(query) || query.includes(date)) {
                        skipTrimFloor++;
                    }

                    // just +1 for a match in description
                    if (description.includes(query)) local_matches++;

                    // entry is the only match if it fully matches title
                    if (title === query) {
                        global_matches = new Array(this.n_of_entries);
                        global_matches[id] = 1;
                        minFloor = 0;
                        break;
                    }

                    global_matches[id] = local_matches;
                }
            });

        // floor trimming
        for (let _ = 0; _ < minFloor; _++) {
            let skipFilter = false;
            if (skipTrimFloor > 0) {
                skipFilter = true;
                skipTrimFloor--;
            }

            for (let m_index = 0; m_index < this.n_of_entries; m_index++) {
                // skip break if <= 3 entries left and skipFilter is kinda 'exhausted'
                if (global_matches.filter(matches => matches > 0 ).length <= 3 && !skipFilter) break;

                // global_matches[m_index]--;
                if (global_matches[m_index] < 0) global_matches[m_index] = 0;
            }
        }

        // console.log(global_matches);

        // return ids by sorting by number of local matches and filtering out matches <= 0
        const ids = Array.from(global_matches.keys())
            .sort((matches1, matches2) => global_matches[matches2] - global_matches[matches1])
            .filter(id => global_matches[id] > 0 );

        return ids;
    }
}

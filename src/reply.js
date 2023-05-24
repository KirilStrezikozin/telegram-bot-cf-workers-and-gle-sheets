/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 */


/**
 * Get bot reply message text
 */
export function getReply(msgType, lang, first_name = "") {
    //return "hooray";
    const botReplies = new Map([
        ["welcome", new Map([
            ["ua", 
                `🥳 📚 *Вітаю, ${first_name}!*\n\n` +
                "Твоя відданість та працьовитість принесуть плоди. Прийми найщиріші побажання успіху та досягнень!\n\n" +
                "🇺🇦 Ти - майбутнє нашої країни. Розкрий свій потенціал, набувай знання та відкривай нові горизонти!\n\n" +
                "__Ми віримо в тебе! Завтрашній день належить тобі. Успіхів у підготовці до іспитів!__ 😇\n"
            ],
            ["en",
                `🥳 📚 *Welcome, ${first_name}!*\n\n` +
                "Your dedication and hard work will pay off. Accept the most sincere wishes for success and achievements!\n\n" +
                "🇺🇦 You're the future. Unleash your potential, gain knowledge and open new horizons!\n\n" +
                "__You're our hope! Tomorrow is yours. Good luck with the exams! 😇\n"
            ]])],

        ["help", new Map([
            ["ua",
                "👋 *Привіт*,\n\n" +
                "🤝 Я - твій вірний супутник у світі історії. Моє завдання - надавати тобі швидкі й точні відповіді на запити!\n\n" +
                "💬 Щоб розпочати, відправляй назву події, рік або ім'я діяча та отримуй цікаві факти, інформацію і документи.\n\n" +
                "Тисни в моєму меню:\n" +
                "`/help` - відправлю це повідомлення знову\n" +
                "`/language` - змінюй мову // change the language\n" +
                "`/random` - випадкова цікавинка\n\n" +
                "✨ *Хай щастить!*\n"
            ],
            ["en",
                "👋 *Hi*,\n\n" +
                "🤝 I'm your faithful assistant in the world of history. My task is to provide you with quick and accurate answers to your queries!\n\n" +
                "💬 To get started, send an event title, year or name of the historical figure and I'll get you flooded with interesting facts, information and documents.\n\n" +
                "Press in my menu:\n" +
                "`/help` - resend this message\n" +
                "`/language` - change the language\n" +
                "`/random` - a random history fact\n\n" +
                "✨ Good luck!\n"
            ],
        ])],

        ["language", new Map([
            ["ua", "⚡ Бот-Архіваріус пропонує тобі обрати мову з доступних нижче:\n"],
            ["en", "⚡ Bot-Archivarius offers you to choose a preferred language from the available ones below:\n"],
        ])],

        ["language_set", new Map([
            ["ua", "Боту встановлено *українську* мову\n"],
            ["en", "Bot language set to *English*\n"],
        ])],

        ["invalid", new Map([
            ["ua", new Array([
                "😕 Не знаю, як на це відповідати\n",
                "😕 Спробуй ще раз\n",
                "😕 Упс, що ти мав(ла) на увазі?\n",
                "😕 Пробач, це поза моїх можливостей\n",
                "😕 Не розумію тебе\n",
                "😕 Може... Спробуй сформулювати по-іншому\n",
                "😕 На жаль, я не розумію цього\n",
                "😕 Мабуть, відправилось щось не те\n",
                "😕 Ще не настільки розумний для цього\n",
                "😕 Що-що?\n",
                "😕 Га? Не розумію.\n",
                "😕 Ех, ніяк не можу тебе зрозуміти\n",
                "😕 Ой, мої розробники такого не очікували\n",
                "😕 Можливо, спитай щось інше\n"
                ])
            ],
            ["en\n", new Array([
                "😕 Don't know how to reply to this\n",
                "😕 Try again\n",
                "😕 Oops, what did you say?\n",
                "😕 Sorry, that's beyond of my capabilities\n",
                "😕 Don't know what you mean by that\n",
                "😕 Maybe, try to say in a different way\n",
                "😕 Sadly, I don't understand this\n",
                "😕 Sorry, looks like that's an invalid query\n",
                "😕 Not smart enough to handle this yet\n",
                "😕 What do you mean? Try again\n",
                "😕 Sorry?\n",
                "😕 Can't get where you're coming from with that\n",
                "😕 Oh, my developers haven't covered this yet\n",
                "😕 Maybe say something else?\n"
                ])
            ],
        ])],
    ]);

    return botReplies.get(msgType).get(lang);
}

// console.log(getReply("welcome", "ua"));

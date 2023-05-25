/**
 * https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets
 */


/**
 * Get bot reply message text
 */
export function getReply(msgType, lang, first_name = "") {
    const botReplies = new Map([
        ["welcome", new Map([
            ["ua", 
                `🥳 📚 *Вітаю, ${first_name}!*\n\n` +
                "Твоя відданість та працьовитість принесуть плоди. Прийми найщиріші побажання успіху та досягнень!\n\n" +
                "🇺🇦 Ти - майбутнє нашої країни. Розкрий свій потенціал, набувай знання та відкривай нові горизонти!\n\n" +
                "__Ми віримо в тебе! Завтрашній день належить тобі. Усього найкращого!__ 😇\n"
            ],
            ["en",
                `🥳 📚 *Welcome, ${first_name}!*\n\n` +
                "Your dedication and hard work will pay off. Accept the most sincere wishes for success and achievements!\n\n" +
                "🇺🇸 You're the future. Unleash your potential, gain knowledge and open new horizons!\n\n" +
                "__You're our hope! Tomorrow is yours. Wishing you the best! 😇\n"
            ]])],

        ["help", new Map([
            ["ua",
                "👋 *Привіт*,\n\n" +
                "🤝 Я - твій вірний супутник у світі історії. Моє завдання - надавати тобі швидкі й точні відповіді на запити!\n\n" +
                "💬 Щоб розпочати, відправляй назву події, рік або ім'я діяча та отримуй цікаві факти, інформацію і документи. " +
                "Під цим повідомленням є кнопка з прикладом пошукового запиту. Клацай на неї, щоб побачити як все працює.\n\n" +
                "Тисни в моєму меню:\n" +
                "/help - відправлю це повідомлення знову\n" +
                "/language - змінюй мову\n" +
                "/random - випадкова цікавинка\n\n" +
                "✨ *Хай щастить!*\n"
            ],
            ["en",
                "👋 *Hi*,\n\n" +
                "🤝 I'm your faithful assistant in the world of history. My task is to provide you with quick and accurate answers to your queries!\n\n" +
                "💬 To get started, send an event title, year or name of the historical figure and I'll get you flooded with interesting facts, information and documents. " +
                "There's a button below this message with a search query example. Press on it to see how everything works.\n\n" +
                "Press in my menu:\n" +
                "/help - resend this message\n" +
                "/language - change the language\n" +
                "/random - a random history fact\n\n" +
                "✨ Good luck!\n"
            ],
        ])],

        ["invoke_about_us", new Map([
            ["ua", "💎 Про бота"],
            ["en", "💎 About this bot"],
        ])],

        ["about_us_keyboard", new Map([
            ["ua", new Array(
                { text: "🎓 Школа Educator", url: 'https://educator.weblium.site' },
                { text: "👨‍💻 Код проєкту на GitHub", url: 'https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets' })
            ],
            ["en", new Array(
                { text: "🎓 Educator School", url: 'https://educator.weblium.site' },
                { text: "👨‍💻 Project on GitHub", url: 'https://github.com/KirilStrezikozin/telegram-bot-cf-workers-and-gle-sheets' })
            ],
        ])],

        ["about_us", new Map([
            ["ua",
                "🎩 Історик-Архіваріус - це твій цифровий друг з Історії або, можливо, краще буде сказати, твоя швидка шпаргалка з Історії України, що довзволяє " +
                "будь-кому, хто цікавиться історією або готується до тестів й іспитів, на льоту знаходити інформацію про події, дати та людей за допомогою простого запиту.\n\n" +
                "💡 Перевага такої системи - це, очевидно, швидкість, але вона також привчає твій мозок асоціювати об'ємну інформацію, яку необхідно запам'ятати, з короткими та точними ключовими словами-запитами. " +
                "У результаті цього, у твоїй пам'яті формується чіткий зв'язок між невеликими шматочками тексту та більшими, що надзвичайно допомагає під час іспитів чи тестів, " +
                "де ти у виграші, якщо здатен належним чином зіставляти окремі частини речень в питанні, щоб знаходити правильні відповіді та заощаджувати безліч часу для зосередження " +
                "на складніших завданнях.\n\n" +
                "⚙️  Цей дивовижний помічник був створений командою учнів з [Онлайн школи Educator](https://educator.weblium.site) під час проєктного тижня в кінці семестру, " +
                "де команди з різних класів розробляють разом щось нове й цікаве. Нашою ідеєю став Телеграм-бот.\n\n" +
                "Спочатку, не маючи знань про створення ботів, процес нагадував катастрофу. Але, прагнучи досягти поставленої цілі, ми крок за кроком просувались до фінішу. " +
                "Також те, що надзвичайно вплинуло на успіх, - це наша команда. Суміш з любителів історії, художника, редактора, програміста, спікера й вчителя разом доклали зусиль, " +
                "прагнучи створити щось корисне.\n\n" +
                "👇 Клікай на ці прекрасні покликання нижче. Одне приведе тебе на сторінку веб-сайту школи, а друга - до сторінки коду проєкта на GitHub, " +
                "де ти зможеш поглянути ближче на те, як працює бот. Якщо тобі сподобався бот і в тебе з'явилося бажання підтримати його подальшу розробку, пиши сюди: @heiskempler.\n\n" +
                "🙏 Дякую тобі за увагу!\n", 
            ],
            ["en",
                "🎩 Historic-Archivarius is your digital history friend or, maybe it'll be better to say, your fast cheat sheet for the History of Ukraine that allows " +
                "anyone curious or who are preparing for exams to rapidly search information about events, dates, and people based on a simple query.\n\n" +
                "💡 The benefit of such system is, obviously, speed but also it triggers your brain to associate long information that has to be memorised with short and precise keywords or queries. " +
                "As a result, there's a linkage formed in your memory and the ability to connect small chunks of text with larger ones which tremendously helps in exams or tests " +
                "where you're at advantage if you can relate words or pieces of text in the question properly to give correct answers faster which will save you a ton of time to be able to focus " +
                "more when you encounter something harder than usual.\n\n" +
                "⚙️ This awesome helper was created by a team of students at [Educator Online School](https://educator.weblium.site/) as part of the end-of-term project creation week " +
                "where each class gathers up a team and devises their initiative. We embarked on the development of a Telegram bot.\n\n" +
                "At first, having no knowledge on how to make bots, it felt disastrous. But we strived to accomplish it and, little by little, we made our way through to where we're right now. " +
                "What also had a profound impact on the success is the team itself. A mixture of a programmer, writer, artist, speaker, teacher, and history lovers altogether endeavored to create.\n\n" +
                "👇 Make sure you check out these beautiful links below. One will get you to our school website, another - to project code on GitHub, " +
                "which you can explore to get a closer look on how the bot works internally. If you like our bot and thought about supporting its further development, dm @heiskempler.\n\n" +
                "🙏 Thank you!\n", 
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

        ["language_emoji", new Map([
            ["ua", "🇺🇦"],
            ["en", "🇺🇸"],
        ])],

        ["search_word", new Map([
            ["ua", "Шукати"],
            ["en", "Search"],
        ])],

        ["stop", new Map([
            ["ua", new Array(
                `👋 Дякую за твою вірність та активність, ${first_name}!\n\n` +
                "Мені було надзвичайно цікаво розділяти з тобою захоплюючий шлях вивчення історії! Я сподіваюся, мої відповіді надавали тобі нові відкриття і знання.\n\n" +
                "💯 Історія - неймовірна й важлива, і нам всім слід споглядати її красу та користь!\n\n" +
                "🥺 ", 

                new Array(
                    "Був радий тобі допомогти!\n",
                    "Побачимось ще!\n",
                    "Успіхів тобі!\n",
                    "Я завжди буду тут, якщо тобі знадобиться допомога!\n",
                    "Бувай!\n",
                    "До зустрічі!\n",
                    "Усього найкращого!\n",
                ))
            ],
            ["en", new Array(
                `👋 Thank you for your activity, ${first_name}!\n\n` +
                "It has been an exciting journey of exploring history with you! I hope that my answers helped you gain new knowledge and conquer new horizons.\n\n" +
                "💯 History is immensely significant and vitally important in our lives!\n\n" +
                "🥺 ", 

                new Array(
                    "It was a pleasure to help you!\n",
                    "See you soon!\n",
                    "Wish you luck!\n",
                    "I'll be here if you'll need help!\n",
                    "See you later!\n",
                    "Goodbye!\n",
                    "All the best!\n",
                ))
            ],
        ])],

        ["hi", new Map([
            ["ua", new Array(
                "Привіт\n",
                "Як справи?\n",
                "Давно не бачились\n",
                "Знову за історію?\n",
                "Моє життя... Воно без відпочинку\n",
                "Я тут\n",
                "Ти вже тут?\n",
                "Я готовий\n",
                "Раз, два, три. Зв'язок в нормі.\n",
                "Ну що ж, давай починати\n",
                "Вітаю!\n",
                "О, а ось і ти\n",
                "Привіт, а я тебе чекав\n",
                "Радий тебе чути\n")
            ],
            ["en", new Array(
                "Hi\n",
                "Hello\n",
                "What's up?\n",
                "How ya doing?\n",
                "Long time no see\n",
                "Problems with history again?\n",
                "Oh, my life has no rest\n",
                "I'm here\n",
                "Ready.\n",
                "One, two, three. Connection Ok.\n",
                "Haven't seen you for ages\n",
                "Hi, where have you been?\n",
                "Let me teach you some history\n",
                "Welcome back\n",
                "It's nice you're back\n",
                "History time\n")
            ],
        ])],

        ["thanks", new Map([
            ["ua", new Array(
                "Дякую\n",
                "Дякую\n",
                "Дякую\n",
                "Дякую тобі\n",
                "Дякую тобі\n",
                "Дякую тобі\n",
                "Радий допомогти\n",
                "Радий допомогти\n",
                "Радий допомогти\n",
                "От бачиш, не все так й складно\n",
                "Звертайся ще\n",
                "Давай ще раз?\n",
                "Ану, давай далі щось шукати)\n",
                "Так, а тепер постарайся це запам'ятати\n",
                "От бачиш, все просто\n",
                "Без проблем\n",
                "Я вже злякався, що тобі не сподобалось\n",
                "Завжди готовий допомогти\n",
                "До ваших послуг)\n",
                "Щиро дякую\n")
            ],
            ["en", new Array(
                "Thanks\n",
                "Thanks\n",
                "Thanks\n",
                "Thanks\n",
                "Thanks\n",
                "You're welcome\n",
                "You're welcome\n",
                "You're welcome\n",
                "You're welcome\n",
                "You're welcome\n",
                "I'm always ready to help\n",
                "No problem\n",
                "One more?\n",
                "Let's do it again\n",
                "See, it's that easy!\n",
                "Come on\n",
                "All thanks to me)\n",
                "Well, how about you memorize it now?\n",
                "History is easy when it's a game\n",
                "Appreciate it\n",
                "Appreciate it\n")
            ],
        ])],

        ["invalid", new Map([
            ["ua", new Array(
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
                "😕 Можливо, спитай щось інше\n")
            ],
            ["en", new Array(
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
                "😕 Maybe say something else?\n")
            ],
        ])],
    ]);

    const reply = botReplies.get(msgType).get(lang);
    if (!reply) return "500: Reply wasn't found";
    else return reply;
}

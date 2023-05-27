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
                `👋 *Привіт, ${first_name}*!\n\n` +
                "🤝 Я - твій вірний супутник у світі історії. Моє завдання - надавати тобі швидкі й точні відповіді на запити!\n\n" +
                "💬 Щоб розпочати, *відправляй назву події, рік або ім'я діяча та отримуй цікаві факти, інформацію і документи*. " +
                "Під цим повідомленням є кнопка з прикладом пошукового запиту. Клацай на неї, щоб побачити як все працює.\n\n" +
                "*Тисни в моєму меню:*\n" +
                "/help - це повідомлення\n" +
                "/language - змінюй мову\n" +
                "/random - випадкова цікавинка\n" +
                "/about - про бота\n" +
                "/lifehack - корисні лайфхаки\n\n" +
                "✨ *Хай щастить!*\n"
            ],
            ["en",
                `👋 *Hi, ${first_name}*!\n\n` +
                "🤝 I'm your faithful assistant in the world of history. My task is to provide you with quick and accurate answers to your queries!\n\n" +
                "💬 To get started, *send an event title, year or name of the historical figure and I'll get you flooded with interesting facts, information and documents*. " +
                "There's a button below this message with a search query example. Press on it to see how everything works.\n\n" +
                "*Press in my menu:*\n" +
                "/help - resend this message\n" +
                "/language - change the language\n" +
                "/random - a random history fact\n" +
                "/about - about the bot\n" +
                "/lifehack - history life hacks\n\n" +
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
                "🎩 *Історик-Архіваріус* - це твій цифровий друг з Історії або, можливо, краще буде сказати, твоя швидка шпаргалка з Історії України, що довзволяє " +
                "будь-кому, хто цікавиться історією або готується до тестів й іспитів, на льоту знаходити інформацію про події, дати та людей за допомогою простого запиту.\n\n" +
                "💡 *Перевага такої системи* - це, очевидно, швидкість, але вона також привчає твій мозок асоціювати об'ємну інформацію, яку необхідно запам'ятати, з короткими та точними ключовими словами-запитами. " +
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
                "🙏 *Дякую тобі за увагу!*\n", 
            ],
            ["en",
                "🎩 *Historic-Archivarius* is your digital history friend or, maybe it'll be better to say, your fast cheat sheet for the History of Ukraine that allows " +
                "anyone curious or who are preparing for exams to rapidly search information about events, dates, and people based on a simple query.\n\n" +
                "💡 *The benefit of such system is*, obviously, speed but also it triggers your brain to associate long information that has to be memorised with short and precise keywords or queries. " +
                "As a result, there's a linkage formed in your memory and the ability to connect small chunks of text with larger ones which tremendously helps in exams or tests " +
                "where you're at advantage if you can relate words or pieces of text in the question properly to give correct answers faster which will save you a ton of time to be able to focus " +
                "more when you encounter something harder than usual.\n\n" +
                "⚙️ This awesome helper was created by a team of students at [Educator Online School](https://educator.weblium.site/) as part of the end-of-term project creation week " +
                "where each class gathers up a team and devises their initiative. We embarked on the development of a Telegram bot.\n\n" +
                "At first, having no knowledge on how to make bots, it felt disastrous. But we strived to accomplish it and, little by little, we made our way through to where we're right now. " +
                "What also had a profound impact on the success is the team itself. A mixture of a programmer, writer, artist, speaker, teacher, and history lovers altogether endeavored to create.\n\n" +
                "👇 Make sure you check out these beautiful links below. One will get you to our school website, another - to project code on GitHub, " +
                "which you can explore to get a closer look on how the bot works internally. If you like our bot and thought about supporting its further development, dm @heiskempler.\n\n" +
                "🙏 *Thank you!*\n", 
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

        ["all_word", new Map([
            ["ua", "Усі"],
            ["en", "All"],
        ])],

        ["search_word", new Map([
            ["ua", "Шукати"],
            ["en", "Search"],
        ])],

        ["searching_word", new Map([
            ["ua", "🔎 Шукаю...\n"],
            ["en", "🔎 Searching for...\n"],
        ])],

        ["search_choose_exact", new Map([
            ["ua",
                "Мені вдалося знайти декілька результатів, що відповідають твоєму запиту. Поглянь на назви нижче і *обери номер*, який бажаєш повністю побачити, або _Усі_:\n\n"
            ],
            ["en",
                "I found several results matching your query. Have a look at their titles below and choose number of the one you'd like to see the full information about, or press _All_:\n\n"
            ],
        ])],

        ["entry_description_emoji", new Map([
            ["ua", new Array("📗", "📕", "📙", "📃", "📘", "📒", "📓", "📜")],
            ["en", new Array("📗", "📕", "📙", "📃", "📘", "📒", "📓", "📜")],
        ])],

        ["lifehack", new Map([
            ["ua", new Array(
                `👋 Привіт, ${first_name}!\n\n` +
                "🧐 Якщо, користуючись нашим ботом, ти зацікавився у такій хитрій науці як історія, ось тобі невеликий список порад. Мершій *обирай один з лайфаків під твоєю клавіатурою*!\n",
                new Array(
                    new Array({text: "🔎 Джерела"}, {text: "🕵️ Розуміння періоду"}),
                    new Array({text: "🧠 Запам'ятовування дат"}),
                    new Array({text: "🥇 Як дізнатися більше"}, {text: "📖 Література"}),
                ),
                new Map([
                    ["lifehack_source", new Array(
                        "🔎 *Джерела*\n" +
                        "Ми, історики, - творчі люди, тому і ти не будь односторонньою людиною, а бери інформацію для своїх робіт як мінімум з трьох джерел для запобігання впливу моралі у своїх роботі.\n"
                        )
                    ],
                    ["lifehack_understand", new Array(
                        "🕵️ *Розуміння періоду*\n" +
                        "Для поглибленого вивчення історичного періоду вивчай біографії ключових людей. Це допоможе тобі краще зрозуміти, яка ситуація була у культурній та соціальній сфері того часу.\n"
                        )
                    ],
                    ["lifehack_memory", new Array(
                        "🧠 *Запам'ятовування дат*\n" +
                        "Якщо запам’ятовування дат дається тобі складно, є два способи для поглегшення цієї задачі:\n",

                        "🔥 *Перший спосіб* - розбивати дати на дві частини. Наприклад, 1799 розбиваємо, і виходить 17-99.\n",

                        "🔥 *Другий* - асоціювати дати з чимось. Це може бути будь-що від форми цифр до власних асоціацій.\n"
                        )
                    ],
                    ["lifehack_more", new Array(
                        "🥇 *Як дізнатися більше*\n" +
                        "Щоб ще більше зацікавитись історією, потворюй ці кроки:\n",

                        "⭐ Для початку обери собі період, дату або подію.\n",
                        "⭐ Вивчай її настільки, наскільки зможеш.\n",
                        "⭐ Відштовхуйся від вивченого назад і вперед, щоб дізнаватись переісторію або наслідки. В результаті вивчиш набагато більше нових і цікавих подій.\n"
                        )
                    ],
                    ["lifehack_read", new Array(
                        "📖 *Література*\n" +
                        "Ось деяка якісна література від нас. Вона підійде як для новачків, так і для сильних істориків:\n",

                        "⚡ _Історія Риму - Теодор Момзен_\n",
                        "⚡ _Mein Kampf - Адольф Гітлер_\n",
                        "⚡ _Історія занепаду та загибелі Римської імперії - Єдуард Гіббон_\n",
                        "⚡ _Брами Європи - Сергій Плохій_\n",
                        "⚡ _Матеріальна цивілізація, єкономіка і капіталізм - Фернан Бордель_\n"
                        )
                    ]
                ])
            )],
            ["en", new Array(
                `👋 Hi, ${first_name}!\n\n` +
                "🧐 If you're interested in the fascinating science of history, here are some handy tips for you. *Choose one of the life hacks right under your keyboard*!\n",
                new Array(
                    new Array({text: "🔎 Sources"}, {text: "🕵️ Understand the period"}),
                    new Array({text: "🧠 Memorizing dates"}),
                    new Array({text: "🥇 Learn more"}, {text: "📖 Literature"})
                ),
                new Map([
                    ["lifehack_source", new Array(
                        "🔎 *Sources*\n" +
                        "We, historians, are creative people, and so should you be. Gather information for your work from at least three different sources to avoid the influence of bias in your research.\n"
                        )
                    ],
                    ["lifehack_understand", new Array(
                        "🕵️ *Understand the period*\n" +
                        "For a deeper understanding of a historical period, delve into the biographies of key individuals. This will help you better grasp the cultural and social dynamics of that time.\n"
                        )
                    ],
                    ["lifehack_memory", new Array(
                        "🧠 *Memorizing dates*\n" +
                        "If remembering dates is challenging for you, there are two methods to make it easier:\n",

                        "🔥 The first method is to break down dates into two parts. For example, split 1799 into 17-99.\n",

                        "🔥 The second method is to associate dates with something. It can be anything from the numerical shape to your personal associations.\n"
                        )
                    ],
                    ["lifehack_more", new Array(
                        "🥇 *Learn more*\n" +
                        "To further ignite your interest in history, follow these steps:\n",

                        "⭐ Start by choosing a period, date, or event.\n",
                        "⭐ Study it as much as you can.\n",
                        "⭐ Connect what you've learned backward and forward to discover the prehistory or consequences. As a result, you'll uncover many more fascinating events.\n"
                        )
                    ],
                    ["lifehack_read", new Array(
                        "📖 *Literature*\n" +
                        "Here is some quality literature from us. It is suitable for both beginners and seasoned historians:\n",

                        "⚡ _History of Rome - Theodor Mommsen_\n",
                        "⚡ _Mein Kampf - Adolf Hitler_\n",
                        "⚡ _The History of the Decline and Fall of the Roman Empire - Edward Gibbon_\n",
                        "⚡ _Gates of Europe - Serhii Plokhy_\n",
                        "⚡ _The Wheels of Commerce: Civilization and Capitalism - Fernand Braude_\n"
                        )
                    ]
                ])
            )],
        ])],

        ["lifehack_again", new Map([ 
            ["ua", "🔥 Ще лайфхаки"],
            ["en", "🔥 More life hacks"],
        ])],

        ["invoke_lifehack_again", new Map([
            ["ua", new Array(
                "👇 Погнали\n",
                "👇 Осьо ще\n",
                "👇 Ось ще лайфхаки\n",
                "👇 Тримай!\n",
                "👇 Вибирай під своєю клавіатурою\n",
                "👇 Готово! Обирай\n",
                "👇 Я радий, що тобі сподобалось\n",
                "👇 Корисно, правда?\n",
                "👇 Тисни ще\n",
                "👇 А тут їх чимало\n",
                "👇 Сподобалось?\n",
                "👇 Звичайно! Обирай ще\n")
            ],
            ["en", new Array(
                "👇 Come on\n",
                "👇 Here are more\n",
                "👇 Here are more for you\n",
                "👇 Choose one under your keyboard\n",
                "👇 I’m glad you liked them\n",
                "👇 Here you go\n",
                "👇 You will learn a lot\n",
                "👇 Okay\n",
                "👇 No problem\n")
            ],
        ])],

        ["searching_process", new Map([
            ["ua", new Array(
                "Хвилиночку...\n",
                "Момент...\n",
                "Шукаю...\n",
                "Вже шукаю...\n",
                "Майже готово...\n",
                "Ще зовсім трохи...\n",
                "Пошук...\n",
                "Триває пошук...\n",
                "Зараз знайду...\n",
                "Хмм. Воно має бути десь тут...\n",
                "Хмм...\n",
                "Ага. Хвилинку...\n",
                "О, я знаю, де це знайти...\n",
                "Вже надсилаю...\n",
                "А ось і воно...\n",
                "Я думав, це всім відомо...\n",
                "Сподіваюсь, ти користуєшся мною не на контрольній...\n",
                "Майже готовий поділитися інформацією...\n",
                "Ось що вдалося знайти...\n",
                "Намагаюся якнайшвидше...\n",
                "Триває пошук данних...\n",
                "Займаюся пошуком...\n",
                "Виявляю потрібну інформацію...\n",
                "Збираю дані...\n",
                "Прикладаю всі свої зусилля...\n",
                "Поглядаю по всім куточкам...\n",
                "Зовсім скоро буде відповідь...\n",
                "Це точно має бути в моїй базі...\n",
                "Не зупинюсь, поки не знайду...\n",
                "Активно шукаю відповідь...\n",
                "Досліджую...\n",
                "Перевіряю дані...\n",
                "Ретельно шукаю...\n",
                "Намагаюся розплутати твій запит...\n",
                "Пошук триває, не втрачай надію...\n",
                "Ще зовсім трошки терпіння...\n")
            ],
            ["en", new Array(
                "Just a moment...\n",
                "Hold on...\n",
                "Searching...\n",
                "Let me find that...\n",
                "Still searching...\n",
                "Almost there...\n",
                "Just a little longer...\n",
                "The search is ongoing...\n",
                "I'll find it soon...\n",
                "Hmm. It should be somewhere here...\n",
                "Hmm...\n",
                "Ah, here it is...\n",
                "I know where to find it...\n",
                "Sending it now...\n",
                "Here it is...\n",
                "I thought everyone knew this...\n",
                "Hopefully, you're not having a test right now and using me...\n",
                "Actively searching for an answer...\n",
                "Carefully checking the data...\n",
                "Just a bit more patience, I'm figuring it out...\n",
                "Doing everything possible...\n",
                "Thoroughly analyzing your query...\n",
                "Tracking that one down...\n",
                "Collection data...\n",
                "Trying my best...\n",
                "Double-checking what I've found...\n",
                "The search continues, don't lose hope...\n",
                "Digging deeper into the matter...\n",
                "Still on the lookout...\n",
                "Expanding the search scope...\n",
                "Finding you this one...\n",
                "Checking what I've found...\n",
                "Actively searching...\n",
                "Analyzing your query...\n",
                "And... It's here...\n")
            ],
        ])],

        ["search_not_found", new Map([
            ["ua", new Array(
                "😕 На жаль, нічого не знайдено\n",
                "😕 На жаль, цього не має в моїй базі данних\n",
                "😕 На жаль, пошук не дав результатів\n",
                "😕 Пробач, нічого не вдалося знайти\n",
                "😕 Пробач, по цьому нічого не знайшлося\n",
                "😕 Немає результатів\n",
                "😕 Пошук не виявився вдалим\n",
                "😕 На жаль, не знайшов нічого\n",
                "😕 Не знайшов нічого, спробуй сформулювати по-іншому\n",
                "😕 Такого не знайшов\n",
                "😕 Упс, такого не знайшлося в моїй базі\n",
                "😕 На жаль, про це нічого немає\n",
                "😕 Спробуй сформулювати по-іншому\n",
                "😕 Мабуть, такої інформації в мене немає\n",
                "😕 Не вдалося знайти відповідь на це запитання\n",
                "😕 На жаль, нічого подібного не виявлено\n",
                "😕 Не знайдено інформації, що відповідає вашому запиту\n",
                "😕 За вашим запитом немає результатів\n",
                "😕 Ця історична подія вийшла за межі моїх знань\n",
                "😕 На жаль, не вдається знайти відповідь на це запитання\n",
                "😕 Вибачте, але я не можу знайти інформацію щодо цього запиту\n",
                "😕 Здається, я не маю відповіді на це запитання\n",
                "😕 Пробачте, але я не знайшов відповіді на це запитання\n",
                "😕 Цього не знайдено в моїй базі даних\n",
                "😕 Нажаль, я не маю інформації щодо цього запиту\n",
                "😕 Вибачте, але не вдалося знайти відповідь на це запитання\n",
                "😕 Мабуть, ця історична подія не зберігається у моїх джерелах\n")
            ],
            ["en", new Array(
                "😕 I'm sorry, but I couldn't find any matching results\n",
                "😕 Unfortunately, there are no records that match your search\n",
                "😕 Oops, it seems I couldn't find what you were looking for\n",
                "😕 I'm sorry, but there's no information available for your query\n",
                "😕 Regrettably, I didn't find any relevant data\n",
                "😕 Sorry, but I couldn't locate any matching entries\n",
                "😕 Apologies, but I couldn't retrieve any results\n",
                "😕 Unfortunately, your search didn't yield any results\n",
                "😕 I'm afraid I couldn't find any relevant information\n",
                "😕 Sorry, but I came up empty-handed on this one\n",
                "😕 No results were found for your specific inquiry\n",
                "😕 I couldn't find any data related to your search criteria\n",
                "😕 Regrettably, there's no information available for this request\n",
                "😕 I didn't uncover any matches based on your query\n",
                "😕 I apologize, but it seems there's nothing to display\n",
                "😕 Sorry, but I didn't locate any relevant records\n",
                "😕 Unfortunately, I couldn't find any related entries\n",
                "😕 I'm afraid there are no results that match your search\n",
                "😕 Apologies, but I couldn't find any data points for this query\n",
                "😕 It appears that there is no information available for this search term\n")
            ],
        ])],

        ["stop", new Map([
            ["ua", new Array(
                `👋 Дякую за твою вірність та активність, ${first_name}!\n\n` +
                "Мені було надзвичайно цікаво розділяти з тобою захоплюючий шлях вивчення історії! Я сподіваюся, мої відповіді надавали тобі нові відкриття і знання.\n\n" +
                "💯 Пам'ятайт, історія - це захоплива подорож, яка допомагає нам розуміти світ навколо нас і самих себе.!\n\n" +
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
                "💯 Remember, history is a captivating journey that helps us understand the world around us and ourselves!\n\n" +
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

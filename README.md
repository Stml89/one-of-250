# One of 250

## English

A browser game about job hunting. First you spend half a day as a recruiter and find your own CV in the pile; then you get laid off and hunt for a job yourself, reading vacancies like a detective.

Play: https://stml89.github.io/one-of-250/

Current version: v1.1, with 7 interface languages (en, es, it, fr, ja, ru, zh) and 7 countries (Russia, USA, Spain, Italy, France, Japan, China).

### Structure

| Path | Contents |
|---|---|
| `src/head.html` | `<title>`, fonts and all page styles |
| `src/extra.css` | Styles for the language screen |
| `src/core.js` | Seed and random number generator, small helpers |
| `src/countries.js` | Country data: currencies, salaries, cities, names, companies, CV conventions, job titles; texts in ru and en; `mergeCountryText` |
| `src/ru.js` … `src/zh.js` | One file per language: `LANG.xx` (interface and content) and `COUNTRY_TEXT.xx` (country texts in that language) |
| `src/engine.js` | Logic and screens. Not a single line of player-facing text: everything comes from the language pack |
| `build.sh` | Builds `dist/index.html`, a single file you can open in a browser or put on any static hosting. `dist/` is not in git: after cloning, run `./build.sh` first |
| `tests/run.sh` | Build plus all checks |
| `archive/` | Prototypes v0.4–v0.9, one file each (v0.1–v0.3 were not kept) |

`ru.js` must come first among the language files: it declares `LANG`.

### Build and checks

You need Node.js and Python 3.

```bash
./build.sh
```

```bash
tests/run.sh
```

The full set takes about a minute and a half. Without screenshots (layout checks only) it takes about a minute:

```bash
SHOTS=0 tests/run.sh
```

Checks:

- `tests/langcheck.js`: every language pack has the same structure as English; every language has texts for all countries; every screen renders in every language without `undefined`, `NaN` or unfilled `{male|female}` templates; every real-world figure has a source link.
- `tests/balance.js`: the daily run with one seed is identical in every language; full runs across all countries and languages finish without errors; the job-found rate for playing blind and for playing well. The outcome of a run does not depend on the language, so balance is measured on 60 runs per country in English, and the other languages get 6 full runs per country to catch broken text (`BALANCE_RUNS` and `SMOKE_RUNS` change these numbers).
- `tests/contrast.py`: every text colour on every background, in the light and dark themes and on the X-ray screen, has contrast of at least 4.5:1 (WCAG AA), and no text is smaller than 12px.
- `tests/screens.spec.js` (Playwright, system Chrome): plays the same run through every screen in every language at phone width (375×812 and a small 375×667) and desktop width (1280px). It fails if the page scrolls sideways, text is cut off on a button, chip or stamp, or anything sticks out of its card. Screenshots go to `tests/screens/phone`, `tests/screens/phone-small` and `tests/screens/desktop` (not written with `SHOTS=0`), together with `index.html`, a contact sheet of screen × language. Needs `npm install` once; without it `tests/run.sh` skips this part.

Expected result for v1.1: 0 structure diffs, 0 missing texts, 0 errors, 0 bad renders.

### Adding a language

1. Copy `src/en.js` to `src/xx.js`, replace `LANG.en` with `LANG.xx` and translate. Every list must keep the same length, or the daily run in that language will differ.
2. Add `COUNTRY_TEXT.xx` at the end of the file with texts for all seven countries (see `es.js` or `ja.js` for an example).
3. Add the code to `LANG_READY` and `LANG_LIST` in `src/engine.js`, and the file to `build.sh`.
4. Run `tests/run.sh`.

Grammatical gender is written inline as a `{male|female}` template. Age, years of experience, "N+ years of experience", notice period and seconds are the functions `age`, `years`, `expFrom`, `notice` and `secs` in the pack.

### Adding a country

1. Add a block to `COUNTRIES` (`src/countries.js`): numbers (`cur`, `per`, `step`, `base`, `fee`, `photo`), ru/en texts, and the key in `COUNTRY_KEYS`.
2. Add that country's texts to `COUNTRY_TEXT` in every language file.
3. Add its figures to `MARKET_STATS` (see below).
4. Run `tests/run.sh`.

### Real labour-market statistics

`MARKET_STATS` in `src/countries.js` holds real figures for each country: unemployment, youth unemployment, the hh.index, vacancies per applicant and so on. Each figure is stored as `[kind, value, "YYYY-MM", source, url]`. The player sees them on the X-ray screen at the end of the job search: the phrase with the figure and the source name are links to the page the figure comes from (they open in a new tab), next to the month of the data. The wording for each kind comes from the language packs (`LANG.xx.facts`).

The figures also drive the mechanics:

- `press`: how many times more applicants a vacancy gets than in the US. This is not a statistic but a design decision based on the figures. The more applicants, the less often a CV gets opened at all.
- `young`: extra competition for a character under 25 where youth unemployment is far above the total.
- `search`: the median length of a job search and the share of long searches, where the country has an official series (so far only the US). The X-ray screen shows it.

`WORLD_STATS` holds figures shared by all countries: 244 applications per vacancy (Greenhouse, 2025; on the shift screen) and 7 seconds per CV (TheLadders, 2018 follow-up study: 7.4 s; in the shift results). Each also links to its source.

Update the figures once a quarter, together with the link if the source has moved. `tests/langcheck.js` prints `stale N` if any figure is older than 12 months, and `no source link N` if a figure has no link. The rule: real figures always come with a source and month; satirical ones never do, so the player can't mistake a joke for a statistic.

### Publishing

`build.sh` builds two variants:

- `dist/index.html`: without `<!doctype>` and `<head>`, for the Claude artifact platform (which adds the wrapper).
- `dist/amplify/index.html` and `dist/amplify.zip`: a complete page for any static hosting (AWS Amplify, S3, Netlify, GitHub Pages). `tools/standalone.py` builds it: it adds the doctype, charset, viewport, the link-preview description and the same CSS reset as the artifact, so the page looks the same in both places. It also sets `window.ONEOF250_PROD=true`: the public build has no "Reset today's result" button, which stays in the artifact for testing.

To check locally before publishing:

```bash
python3 -m http.server 8765 --directory dist/amplify
```

and open http://localhost:8765.

### Deploying to GitHub Pages

`.github/workflows/pages.yml` runs `./build.sh` on every push to `main` and publishes `dist/amplify/index.html`. Turn it on once: **Settings → Pages → Source: GitHub Actions**. Address: https://stml89.github.io/one-of-250/. Build progress is in the **Actions** tab, where you can also start it by hand with **Run workflow**.

GitHub Pages ignores the headers in `deploy/customHttp.yml`: it has its own cache of about 10 minutes.

### Deploying to AWS Amplify

The game is a single static file, so Amplify's "Deploy without Git" mode fits: no build on the AWS side and no repository connection.

#### Option A: in the console (nothing to install)

1. `./build.sh` produces `dist/amplify.zip` (with `index.html` at the root of the archive).
2. AWS console → **AWS Amplify** → **Create new app** → **Deploy without Git**.
3. App name `one-of-250`, branch `main`, drop in `dist/amplify.zip` → **Save and deploy**.
4. **Hosting → Custom headers** → paste the contents of `deploy/customHttp.yml` → **Save**.
5. The game's address will look like `https://main.<app-id>.amplifyapp.com`.

To update: build again and press **Deploy updates** on the same branch, dropping in the new zip.

#### Option B: with the script

You need AWS CLI v2 ([install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) and configured access:

```bash
aws configure
```

Then:

```bash
deploy/amplify-deploy.sh
```

The script builds the game, creates the app and branch on the first run, then on every run uploads a new zip, waits for the deployment to finish and prints the address. You can change the app name, branch and region: `APP_NAME=my-game BRANCH=main AWS_REGION=eu-central-1 deploy/amplify-deploy.sh`. The AWS user needs `amplify:*` permissions for this app.

#### Headers

`deploy/customHttp.yml` sets a 5-minute cache (repeat visits don't reach AWS, and a new version reaches players quickly) and basic security headers. The script applies them itself; in option A you paste them by hand.

#### Cost

The file weighs ~540 KB, ~200 KB compressed in transfer. Amplify charges for outbound traffic (about $0.15 per GB) and storage (negligible). 10,000 players ≈ 2 GB ≈ $0.30; a million ≈ $30. New AWS accounts get a free tier or starter credits; the terms depend on the sign-up date and are shown under Billing → Free Tier.

Before going public, set a budget alert: **Billing → Budgets → Create budget → Zero spend budget** or a **Monthly cost budget** of $5, and you'll get an email if something goes wrong. The alert doesn't switch anything off by itself; if traffic spikes, you can stop the app by deleting the branch in the Amplify console.

## Русский

Браузерная игра о поиске работы. Сначала ты полдня работаешь рекрутером и находишь в стопке собственное резюме, потом тебя сокращают, и ты ищешь работу сам, разгадывая вакансии как детектив.

Играть: https://stml89.github.io/one-of-250/

Текущая версия — v1.1: 7 языков интерфейса (en, es, it, fr, ja, ru, zh) и 7 стран (Россия, США, Испания, Италия, Франция, Япония, Китай).

### Структура

| Путь | Что внутри |
|---|---|
| `src/head.html` | `<title>`, шрифты и все стили страницы |
| `src/extra.css` | Стили экрана выбора языка |
| `src/core.js` | Сид и генератор случайных чисел, мелкие помощники |
| `src/countries.js` | Данные стран: валюты, зарплаты, города, имена, компании, оформление, должности; тексты на ru и en; `mergeCountryText` |
| `src/ru.js` … `src/zh.js` | По файлу на язык: `LANG.xx` (интерфейс и контент) и `COUNTRY_TEXT.xx` (тексты стран на этом языке) |
| `src/engine.js` | Логика и экраны. Ни одной строки текста — всё берётся из языкового пакета |
| `build.sh` | Собирает `dist/index.html` — один файл, который можно открыть в браузере или выложить на любой статический хостинг. `dist/` не хранится в git: после клонирования сначала `./build.sh` |
| `tests/run.sh` | Сборка и все проверки |
| `archive/` | Прототипы v0.4–v0.9 одним файлом (v0.1–v0.3 не сохранились) |

`ru.js` должен идти первым из языковых файлов: в нём объявлен `LANG`.

### Сборка и проверки

Нужны Node.js и Python 3.

```bash
./build.sh
```

```bash
tests/run.sh
```

Весь набор идёт около полутора минут. Без скриншотов (только проверки вёрстки) — около минуты:

```bash
SHOTS=0 tests/run.sh
```

Проверки:

- `tests/langcheck.js` — структура каждого языкового пакета совпадает с английским; у каждого языка есть тексты для всех стран; все экраны отрисовываются во всех языках без `undefined`, `NaN` и неподставленных шаблонов `{м|ж}`; у каждой реальной цифры есть ссылка на источник.
- `tests/balance.js` — забег дня с одним сидом одинаков на всех языках; полные прогоны забегов по всем странам и языкам без ошибок; доля найденной работы для игры «не глядя» и для хорошей игры. Исход забега от языка не зависит, поэтому баланс считается по 60 забегам на страну на английском, а остальные языки проходят по 6 полных забегов на страну, чтобы поймать битый текст (`BALANCE_RUNS` и `SMOKE_RUNS` меняют эти числа).
- `tests/contrast.py` — контраст каждого цвета текста на каждом фоне в светлой, тёмной теме и на рентгене не ниже 4,5:1 (WCAG AA), и нигде нет текста мельче 12px.
- `tests/screens.spec.js` (Playwright, системный Chrome) — проходит один и тот же забег по всем экранам на всех языках при ширине телефона (375×812 и маленького 375×667) и компьютера (1280px). Падает, если страница прокручивается вбок, обрезан текст на кнопке, чипе или штампе или что-то вылезает за карточку. Скриншоты кладёт в `tests/screens/phone`, `tests/screens/phone-small` и `tests/screens/desktop` (с `SHOTS=0` не пишет их), там же `index.html` — сводная таблица «экран × язык». Нужен один раз `npm install`; без него `tests/run.sh` эту часть пропускает.

Ожидаемый результат v1.1: 0 расхождений структуры, 0 пропущенных текстов, 0 ошибок, 0 битых отрисовок.

### Как добавить язык

1. Скопировать `src/en.js` в `src/xx.js`, заменить `LANG.en` на `LANG.xx` и перевести. Все списки должны остаться той же длины — иначе забег дня на этом языке будет другим.
2. Добавить в конец файла `COUNTRY_TEXT.xx` с текстами всех семи стран (образец — в любом из `es.js`, `ja.js`).
3. Добавить код в `LANG_READY` и `LANG_LIST` в `src/engine.js` и файл — в `build.sh`.
4. Запустить `tests/run.sh`.

Род задаётся шаблоном `{мужской|женский}` прямо в строке. Возраст, стаж, «опыт от N лет», срок выхода и секунды — функции `age`, `years`, `expFrom`, `notice`, `secs` в пакете.

### Как добавить страну

1. Добавить блок в `COUNTRIES` (`src/countries.js`): числа (`cur`, `per`, `step`, `base`, `fee`, `photo`), тексты на ru/en, ключ — в `COUNTRY_KEYS`.
2. Добавить тексты этой страны в `COUNTRY_TEXT` каждого языкового файла.
3. Добавить её цифры в `MARKET_STATS` (см. ниже).
4. Запустить `tests/run.sh`.

### Реальная статистика рынка труда

`MARKET_STATS` в `src/countries.js` — настоящие цифры по каждой стране: безработица, молодёжная безработица, hh.индекс, вакансии на соискателя и т. п. Каждая цифра записана как `[вид, значение, "ГГГГ-ММ", источник, ссылка]`. Игрок видит их на рентгене в конце поиска работы: фраза с цифрой и название источника — ссылки на страницу, откуда цифра взята (открываются в новой вкладке), рядом месяц данных. Формулировку для каждого вида дают языковые пакеты (`LANG.xx.facts`).

Цифры работают и в механике:

- `press` — во сколько раз больше откликов на вакансию, чем в США. Это не статистика, а решение дизайнера, основанное на цифрах. Чем больше откликов, тем реже резюме вообще открывают.
- `young` — дополнительная конкуренция для персонажа младше 25 лет там, где молодёжная безработица намного выше общей.
- `search` — медиана длительности поиска и доля долгого поиска, если по стране есть официальный ряд (пока только США). Её показывает рентген в конце.

`WORLD_STATS` — цифры, общие для всех стран: 244 отклика на вакансию (Greenhouse, 2025; на экране смены) и 7 секунд на резюме (TheLadders, повторное исследование 2018 года: 7,4 с; в итогах смены). У каждой тоже есть ссылка на источник.

Цифры обновлять раз в квартал, вместе со ссылкой, если источник переехал. `tests/langcheck.js` печатает `stale N`, если какой-то цифре больше 12 месяцев, и `no source link N`, если у цифры нет ссылки. Правило: реальные цифры — только с источником и месяцем, сатирические — без них, чтобы игрок не спутал шутку со статистикой.

### Публикация

`build.sh` собирает два варианта:

- `dist/index.html` — без `<!doctype>` и `<head>`, для платформы артефактов (обёртку добавляет она).
- `dist/amplify/index.html` и `dist/amplify.zip` — полная страница для любого статического хостинга (AWS Amplify, S3, Netlify, GitHub Pages). Её собирает `tools/standalone.py`: добавляет doctype, charset, viewport, описание для соцсетей и тот же CSS-сброс, что у артефакта, поэтому страница выглядит одинаково в обоих местах. Ещё он ставит `window.ONEOF250_PROD=true`: в публичной сборке нет кнопки «Сбросить результат дня», она остаётся только в артефакте для тестов.

Проверить локально перед выкладкой:

```bash
python3 -m http.server 8765 --directory dist/amplify
```

и открыть http://localhost:8765.

### Деплой на GitHub Pages

`.github/workflows/pages.yml` при каждом пуше в `main` запускает `./build.sh` и выкладывает `dist/amplify/index.html`. Один раз нужно включить: **Settings → Pages → Source: GitHub Actions**. Адрес: https://stml89.github.io/one-of-250/. Ход сборки виден во вкладке **Actions**; запустить вручную — там же, **Run workflow**.

Заголовки из `deploy/customHttp.yml` GitHub Pages не применяет: кэш там свой, около 10 минут.

### Деплой на AWS Amplify

Игра — один статический файл, поэтому подходит режим Amplify «Deploy without Git»: без сборки на стороне AWS и без подключения репозитория.

#### Вариант А: через консоль (без установки чего-либо)

1. `./build.sh` — появится `dist/amplify.zip` (в корне архива лежит `index.html`).
2. Консоль AWS → **AWS Amplify** → **Create new app** → **Deploy without Git**.
3. Имя приложения `one-of-250`, ветка `main`, перетащить `dist/amplify.zip` → **Save and deploy**.
4. **Hosting → Custom headers** → вставить содержимое `deploy/customHttp.yml` → **Save**.
5. Адрес игры будет вида `https://main.<app-id>.amplifyapp.com`.

Для обновления: собрать заново и в той же ветке нажать **Deploy updates**, перетащив новый zip.

#### Вариант Б: скриптом

Нужен AWS CLI v2 ([установка](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) и настроенный доступ:

```bash
aws configure
```

Затем:

```bash
deploy/amplify-deploy.sh
```

Скрипт собирает игру, при первом запуске создаёт приложение и ветку, потом при каждом запуске заливает новый zip, ждёт окончания деплоя и печатает адрес. Имя приложения, ветку и регион можно поменять: `APP_NAME=my-game BRANCH=main AWS_REGION=eu-central-1 deploy/amplify-deploy.sh`. Пользователю AWS нужны права на `amplify:*` для этого приложения.

#### Заголовки

`deploy/customHttp.yml` задаёт кэш на 5 минут (повторные заходы не идут в AWS, а новая версия доходит до игроков быстро) и базовые заголовки безопасности. Скрипт применяет их сам, в варианте А их вставляют вручную.

#### Стоимость

Файл весит ~540 КБ, сжатый при передаче — ~200 КБ. Amplify берёт деньги за исходящий трафик (около $0.15 за ГБ) и хранение (копейки). 10 000 игроков ≈ 2 ГБ ≈ $0,30; миллион — около $30. Новым аккаунтам AWS даёт бесплатный уровень или стартовые кредиты — условия зависят от даты регистрации, их видно в разделе Billing → Free Tier.

Перед публикацией стоит включить бюджетное оповещение: **Billing → Budgets → Create budget → Zero spend budget** или **Monthly cost budget** на $5 — придёт письмо, если что-то пойдёт не так. Оповещение ничего не отключает само; при всплеске трафика приложение можно остановить, удалив ветку в консоли Amplify.

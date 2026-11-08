# LeagueSolver · Swain Lab

Standalone static website, Russian UI, pinned game data 26.22 (Data Dragon 16.22.1). No runtime dependencies, API keys or player statistics.

Run `node server.mjs` and visit http://127.0.0.1:4173. Run `node --test tests/engine.test.mjs` for model checks. Deploy `dist/` as static assets. npm script aliases are also provided.

## Самостоятельный хостинг

Загрузите **содержимое** `dist/` в корневую папку сайта: `index.html`, CSS/JS, папки `assets/` и `data/`. Подойдёт любой обычный статический HTTP-хостинг, включая Nginx, Apache или GitHub Pages. Серверная часть, сборка, GPT Sites и авторизация не требуются. Размещение в подпапке также поддерживается: ресурсы используют относительные пути.

Для локального просмотра: `node server.mjs`. HTML нужно открывать через HTTP, поскольку при открытии файла напрямую браузер ограничивает загрузку модулей и JSON.

## Model contract

Deterministic training-dummy experiment, not an exact reproduction of the game server. Fixed hit delays, 0.25 s shared cast lock, constant contact, identical immortal targets, full mana at start, linear mana regeneration. Potential healing is uncapped. No incoming damage or survival prediction. R enabled throughout. Q/E/W are mana limited. W/E fragments grow HP during combat. Target deaths and ordinary AA damage are excluded; Heartsteel bonus hits are optional. Rylai control and out-of-combat Warmog healing do not receive artificial utility scores.

Exhaustive search covers unique combinations of 8 implemented items and 6 legal skill priorities, constrained by budget and number of items. It does not cover the entire shop, all skill sequences or full rune pages. Conqueror is modeled from zero stacks; no other key rune is implemented. Build ordering compares independent battles after completed items at a fixed champion level, not an economic timeline.

## Data and provenance

- `dist/data/swain.json`: Riot Data Dragon, 16.22.1 champion stats/cooldowns/costs.
- `dist/data/items.json`: Riot Data Dragon, 16.22.1 item descriptions, stats, recipes and prices.
- `dist/data/swain-bin.json`: CommunityDragon extracted game data, pinned 16.22; coefficients checked against model constants.
- Official Riot splash and item images in `dist/assets/`.
- Rune/proc rules cross-checked against League of Legends Wiki, linked inside the app.

The model requires in-game practice-tool validation before claiming server-level accuracy. Full assumptions are visible in the UI.

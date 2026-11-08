# LeagueSolver · Swain Lab

Standalone static website, Russian UI, pinned game data 26.22 (Data Dragon 16.22.1). No runtime dependencies, API keys or player statistics.

Run `node server.mjs` from the repository root and visit http://127.0.0.1:4173. Run `node --test swain-lab/tests/*.test.mjs` from the root for model and deployment-path checks. The website entry point is the root `index.html`. npm script aliases are also provided.

## Самостоятельный хостинг

Для GitHub Pages уже настроен workflow в корне репозитория: `.github/workflows/pages.yml`. Один раз выберите **Settings → Pages → Source → GitHub Actions**, затем отправляйте обновления в `main`. Точка входа `index.html` и ресурсы находятся в корне репозитория. Также поддерживается публикация ветки `main`, папки `/ (root)`; архив ZIP для этого не используется. Инструкции — в [корневом README](../README.md#github-pages).

Загрузите из корня репозитория `index.html`, `app.js`, `engine.js`, CSS, `.nojekyll` и папки `assets/`, `data/` на статический хостинг. Сборка, серверная часть и авторизация не требуются.

Для локального просмотра: `node server.mjs`. HTML нужно открывать через HTTP, поскольку при открытии файла напрямую браузер ограничивает загрузку модулей и JSON.

## Model contract

Deterministic training-dummy experiment, not an exact reproduction of the game server. Fixed hit delays, 0.25 s shared cast lock, constant contact, identical immortal targets, full mana at start, linear mana regeneration. Potential healing is uncapped. No incoming damage or survival prediction. R enabled throughout. Q/E/W are mana limited. W/E fragments grow HP during combat. Target deaths and ordinary AA damage are excluded; Heartsteel bonus hits are optional. Rylai control and out-of-combat Warmog healing do not receive artificial utility scores.

Exhaustive search covers unique combinations of 8 implemented items and 6 legal skill priorities, constrained by budget and number of items. It does not cover the entire shop, all skill sequences or full rune pages. Conqueror is modeled from zero stacks; no other key rune is implemented. Build ordering compares independent battles after completed items at a fixed champion level, not an economic timeline.

## Data and provenance

- `data/swain.json`: Riot Data Dragon, 16.22.1 champion stats/cooldowns/costs.
- `data/items.json`: Riot Data Dragon, 16.22.1 item descriptions, stats, recipes and prices.
- `data/swain-bin.json`: CommunityDragon extracted game data, pinned 16.22; coefficients checked against model constants.
- Official Riot splash and item images in `assets/`.
- Rune/proc rules cross-checked against League of Legends Wiki, linked inside the app.

The model requires in-game practice-tool validation before claiming server-level accuracy. Full assumptions are visible in the UI.

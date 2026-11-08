# LeagueSolver

Статическая лаборатория Свейна: сравнение сборок, графики, открытые формулы и игровые данные 26.22. **Точка входа сайта — `index.html` в корне репозитория.**

## GitHub Pages

Поддерживаются оба способа публикации:

- **Deploy from a branch:** в **Settings → Pages** выбрать ветку `main`, папку **`/ (root)`**. В корне уже находятся `index.html`, `.nojekyll` и все ресурсы сайта.
- **GitHub Actions:** выбрать **Source → GitHub Actions**. Workflow `.github/workflows/pages.yml` проверяет проект и публикует только файлы сайта после push в `main`. В pull request выполняются только проверки.

Не выбирайте папку `/docs`: сайт находится в корне. Если меняете способ публикации на Actions после push, запустите **Actions → Deploy GitHub Pages → Run workflow**.

Адрес после успешной публикации: https://veryDeepWell.github.io/LeagueSolver/.

Пути к модулям, JSON, стилям и изображениям относительные: сайт работает под `/LeagueSolver/` и на собственном домене. Сборка, зависимости и серверная часть не нужны.

## Локальная работа

Из корня репозитория:

```text
node server.mjs
node --test swain-lab/tests/*.test.mjs
```

Сайт: http://127.0.0.1:4173. Node.js нужен для локального просмотра и проверок, на хостинге он не используется.

## Структура

- `index.html`, `app.js`, `engine.js`, `style.css`, `responsive.css` — приложение.
- `assets/` — иконки предметов; `data/` — снимки игровых данных.
- `.nojekyll` — отключает обработку Jekyll.
- `swain-lab/tests/` — проверки расчётов и путей для Pages.
- [Описание модели](swain-lab/README.md).

[Документация GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

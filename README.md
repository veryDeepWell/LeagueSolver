# LeagueSolver

Первая рабочая лаборатория: [Swain Lab](swain-lab/README.md). Сравнение сборок, графики, открытые формулы и зафиксированные игровые данные 26.22.

Запуск из `swain-lab`: `node server.mjs`. Проверка проекта: `node --test tests/*.test.mjs`.

## GitHub Pages

1. Отправьте изменения в ветку `main` репозитория `veryDeepWell/LeagueSolver`.
2. В **Settings → Pages → Build and deployment → Source** выберите **GitHub Actions**.
3. Если первый запуск произошёл до настройки Pages, повторно запустите **Actions → Deploy GitHub Pages → Run workflow**.

Workflow `.github/workflows/pages.yml` проверяет JavaScript, расчёты и пути ресурсов, затем публикует содержимое `swain-lab/dist/`. После каждого push в `main` сайт обновляется автоматически. В pull request выполняются только проверки.

Ожидаемый адрес после успешной публикации: https://veryDeepWell.github.io/LeagueSolver/.

Сайт работает в подпапке репозитория и на собственном домене: пути к модулям, JSON, стилям и изображениям относительные. Сборка и установка зависимостей не нужны. Node.js в Actions используется только для проверок. `.nojekyll` отключает обработку Jekyll при размещении статических файлов.

Документация: [публикация через GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).


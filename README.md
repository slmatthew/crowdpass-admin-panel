# CrowdPass Admin Panel

В этом репозитори хранится исходный код админ-панели CrowdPass

## Установка

1. Склонируйте репозиторий с помощью `git clone`
2. Перейдите в папку с проектом: `cd crowdpass-admin-panel`
3. Выполните установку зависимостей: `npm install`

## Настройка

Для настройки админ-панели используется файл `src/config/appConfig.ts` ([click](https://github.com/slmatthew/crowdpass-admin-panel/blob/dev/src/config/appConfig.ts)). Приложение само будет использовать нужную конфигурацию в зависимости от окружения.

Объяснение полей и их значений:

```ts
const config = {
  vk: {
    app_id: 53595274, // идентично AP_VK_APP_ID в .env бекенда
    redirect_uri: 'https://cps-test-ap.slmatthew.dev/login/vkCallback', // идентично AP_VK_REDIRECT_URI в .env бекенда
    auth_handler_uri: 'https://cps-test.slmatthew.dev/api/auth/vk/callback' // маршрут API, использующийся для проверки данных VK ID
  },
  telegram: {
    widget_url: 'https://oauth.tg.dev/js/telegram-widget.js?22', // используйте заданный изначально URL
    bot_username: 'CrowdPassBot', // юзернейм Telegram-бота
    auth_url: 'https://cps-test.slmatthew.dev/api/auth/telegram/callback', // маршрут API, использующийся для проверки данных Telegram
  },

  apiBaseUrl: 'https://cps-test.slmatthew.dev/api/', // API endpoint. значение API_BASE_URI в .env бекенда с / в конце
};
```

Вам необходимо заменить:
1. `config.vk.app_id` – идентично `AP_VK_APP_ID` в `.env` файле бекенда
2. `config.vk.redirect_uri` – идентично `AP_VK_REDIRECT_URI` в `.env` файле бекенда
3. `config.vk.auth_handler_uri` – заменить домен API на свой
4. `config.telegram.bot_username` – идентично `TELEGRAM_BOT_USERNAME` в `.env` файле бекенда
5. `config.telegram.auth_url` – заменить домен API на свой
6. `config.apiBaseUrl` – идентично `API_BASE_URI` в `.env` файле бекенда, только с добавлением `/` в конце

## Сборка
`npm run build`

## Деплой
Вам необходимо самостоятельно задеплоить приложение, так как я это делал на своём сервере и не пользовался ни GitHub Pages, ни иными хостингами статики
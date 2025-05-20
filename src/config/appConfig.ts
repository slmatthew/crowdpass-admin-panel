const prodConfig = {
  vk: {
    app_id: 53497212,
    redirect_uri: 'https://crowdpass-admin.slmatthew.dev/login/vkCallback',
    auth_handler_uri: 'https://crowdpass-api.slmatthew.dev/api/auth/vk/callback'
  },
  telegram: {
    widget_url: 'https://telegram.org/js/telegram-widget.js?22',
    bot_username: 'CrowdPassBot',
    auth_url: 'https://crowdpass-api.slmatthew.dev/api/auth/telegram/callback',
  },

  apiBaseUrl: 'https://crowdpass-api.slmatthew.dev/api/',
};

const devConfig = {
  vk: {
    app_id: 53595274,
    redirect_uri: 'https://cps-test-ap.slmatthew.dev/login/vkCallback',
    auth_handler_uri: 'https://cps-test.slmatthew.dev/api/auth/vk/callback'
  },
  telegram: {
    widget_url: 'https://oauth.tg.dev/js/telegram-widget.js?22',
    bot_username: 'CrowdPassBot',
    auth_url: 'https://cps-test.slmatthew.dev/api/auth/telegram/callback',
  },

  apiBaseUrl: 'https://cps-test.slmatthew.dev/api/',
};

export const appConfig = import.meta.env.DEV ? devConfig : prodConfig;
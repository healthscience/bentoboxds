import { createI18n } from "vue-i18n"

const messages = {
  en: {
    message: {
      home: 'Home',
      about: 'About',
      help: 'Help'
    }
  },
  es: {
    message: {
      home: 'hogar',
      about: 'acerca de',
      help: 'ayuda'
    }
  },
  zh: {
    message: {
      home: '家',
      about: '关于',
      help: '帮助'
    }
  },
  jp: {
    message: {
      home: '家',
      about: 'について',
      help: 'ヘルプ'
    }
  }
}

export default createI18n({
  locale: 'en', // <--- 1
  fallbackLocale: 'es', // <--- 2
  legacy: false, // <--- 3
  globalInjection: true, // <--- add this
  messages
})

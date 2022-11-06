import i18n from 'i18next';
//import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import dateFormat from 'dateformat';

import { initReactI18next } from "react-i18next";

//.use(initReactI18next)


//var langs = ['en', 'es', 'hy', 'ja', 'ru'];
var langs = ['de', 'en', 'es', 'ja', 'fi'];

i18n
  //.use(Backend)
  .use(LanguageDetector)
  //.use(reactI18nextModule)
  .use(initReactI18next)
  .init({
    fallbackLng: langs[0],
    cookieName: 'l',

    // have a common namespace used around the full app
    ns: ['lang'],
    defaultNS: 'lang',
    whitelist: langs,

    debug: false,

    resources: { 
      en: { lang: require('./lang/lang-en.json') },
      de: { lang: require('./lang/lang-de.json') },
      fi: { lang: require('./lang/lang-fi.json') },
      es: { lang: require('./lang/lang-es.json') },
      hy: { lang: require('./lang/lang-hy.json') },
      ja: { lang: require('./lang/lang-ja.json') },
      ru: { lang: require('./lang/lang-ru.json') }
    },

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true
    }
  });

i18n.on('languageChanged', () => {
  window.lang = i18n.language;
  var t = i18n.t.bind(i18n);
  dateFormat.i18n = {
    dayNames: [
        t('Sun'), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat'),
        t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')
    ],
    monthNames: [
        t('Jan'), t('Feb'), t('Mar'), t('Apr'), t('May'), t('Jun'), t('Jul'), t('Aug'), t('Sep'), t('Oct'), t('Nov'), t('Dec'),
        t('January'), t('February'), t('March'), t('April'), t('May'), t('June'), t('July'), t('August'), t('September'), t('October'), t('November'), t('December')
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
  };
});

window.lang = i18n.language;

//window.t = i18n.t;


export default i18n;

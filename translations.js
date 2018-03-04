/* global locale */
import translations from './translations.json';

const t = (s, l = locale) => {
  try {
    return translations[l][s] ? translations[l][s] : s;
  } catch (e) {
    return s;
  }
};
export default t;

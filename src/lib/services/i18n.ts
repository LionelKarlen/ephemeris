import i18n from 'sveltekit-i18n';
import de from './lang/de';
import en from './lang/en';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	initLocale: 'de',
	translations: { en: en, de: de }
};

export const { t, l, locales, locale } = new i18n(config);

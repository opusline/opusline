/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_SettingsInputs */

const en_page_title_settings = /** @type {(inputs: Page_Title_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

const fr_page_title_settings = /** @type {(inputs: Page_Title_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages`)
};

/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Page_Title_SettingsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_settings = /** @type {((inputs?: Page_Title_SettingsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_SettingsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_settings(inputs)
	return en_page_title_settings(inputs)
});
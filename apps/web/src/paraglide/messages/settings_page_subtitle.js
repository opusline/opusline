/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Page_SubtitleInputs */

const en_settings_page_subtitle = /** @type {(inputs: Settings_Page_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company identity, signature and the tax setup of your micro-entreprise.`)
};

const fr_settings_page_subtitle = /** @type {(inputs: Settings_Page_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identité de la société, signature et fiscalité de votre micro-entreprise.`)
};

/**
* | output |
* | --- |
* | "Company identity, signature and the tax setup of your micro-entreprise." |
*
* @param {Settings_Page_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_page_subtitle = /** @type {((inputs?: Settings_Page_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Page_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_page_subtitle(inputs)
	return en_settings_page_subtitle(inputs)
});
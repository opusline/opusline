/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_DarkInputs */

const en_theme_dark = /** @type {(inputs: Theme_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dark`)
};

const fr_theme_dark = /** @type {(inputs: Theme_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sombre`)
};

/**
* | output |
* | --- |
* | "Dark" |
*
* @param {Theme_DarkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const theme_dark = /** @type {((inputs?: Theme_DarkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_DarkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_dark(inputs)
	return en_theme_dark(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_SystemInputs */

const en_theme_system = /** @type {(inputs: Theme_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System`)
};

const fr_theme_system = /** @type {(inputs: Theme_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Système`)
};

/**
* | output |
* | --- |
* | "System" |
*
* @param {Theme_SystemInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const theme_system = /** @type {((inputs?: Theme_SystemInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_SystemInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_system(inputs)
	return en_theme_system(inputs)
});
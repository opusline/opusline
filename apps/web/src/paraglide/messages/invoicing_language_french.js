/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Language_FrenchInputs */

const en_invoicing_language_french = /** @type {(inputs: Invoicing_Language_FrenchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Français`)
};

const fr_invoicing_language_french = /** @type {(inputs: Invoicing_Language_FrenchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Français`)
};

/**
* | output |
* | --- |
* | "Français" |
*
* @param {Invoicing_Language_FrenchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_language_french = /** @type {((inputs?: Invoicing_Language_FrenchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Language_FrenchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_language_french(inputs)
	return en_invoicing_language_french(inputs)
});
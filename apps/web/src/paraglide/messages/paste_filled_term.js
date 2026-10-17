/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Filled_TermInputs */

const en_paste_filled_term = /** @type {(inputs: Paste_Filled_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment term`)
};

const fr_paste_filled_term = /** @type {(inputs: Paste_Filled_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai de paiement`)
};

/**
* | output |
* | --- |
* | "Payment term" |
*
* @param {Paste_Filled_TermInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_term = /** @type {((inputs?: Paste_Filled_TermInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_TermInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_term(inputs)
	return en_paste_filled_term(inputs)
});